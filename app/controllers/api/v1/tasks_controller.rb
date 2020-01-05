class Api::V1::TasksController < ApplicationController
  before_action :set_task, only: [:show, :update, :destroy]

  # GET /tasks
  def index
    @tasks = Task.all

    render json: @tasks
  end

  # GET /tasks/1
  def show
    render json: @task
  end

  # POST /tasks
  def create
    @task = Task.new(task_params)
    tags = params[:tags]
    logger.warn "@tags received: #{tags}"

    createdTags = tags.select { |tag| tag[:id] < 0 }
    createdTags.map! { |tag| Tag.create(tag_name: tag[:tag_name])  }
    logger.warn "createdTags: #{createdTags}"
    @task.tags << createdTags

    existingTags = tags.select do |tag|
      tag[:id] >= 0
    end
    existingTags.map! do |tag|
      Tag.find(tag[:id])
    end
    logger.warn "existingTags: #{existingTags}"
    @task.tags << existingTags

    data = {:task => @task, :createdTags => createdTags, :existingTags => existingTags}
    logger.warn "data: #{data}"

    if @task.save
      render json: data, status: :created
      # render json: @task, status: :created, location: @task
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /tasks/1
  def update
    tags = params[:tags]
    logger.warn "tags: #{tags}"

    if tags.nil?
      data = {:task => @task, :createdTags => [], :deletedTags => [], :tags => @task.tags}
    else 
      existingTags = tags.select { |tag| tag[:id] >= 0 }
      logger.warn "existingTags: #{existingTags}"
      addedExistingTags = existingTags.filter do |tag|
        !@task.tags.exists?(tag[:id])
      end
      addedExistingTags.map! { |tag| Tag.find(tag[:id])}
      logger.warn "addedExistingTags: #{addedExistingTags}"
      @task.tags << addedExistingTags

      existingTags.map! {|tag| tag[:id]}
      removedTags = @task.tags.filter {|tag| !existingTags.include?(tag[:id])}
      logger.warn "removedTags: #{removedTags}"
      @task.tags.delete(removedTags)

      deletedTags = removedTags.filter { |tag| tag.tasks.length() == 0 }
      deletedTags.each { |tag| tag.destroy }
      logger.warn "deletedTags: #{deletedTags}"

      createdTags = tags.select { |tag| tag[:id] < 0 }
      createdTags.map! { |tag| Tag.create(tag_name: tag[:tag_name])  }
      logger.warn "@createdTags: #{createdTags}"
      @task.tags << createdTags

      data = {:task => @task, :createdTags => createdTags, :deletedTags => deletedTags, :tags => @task.tags}
    end

    if @task.update(task_params)
      render json: data
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  end

  # DELETE /tasks/1
  def destroy
    tags = @task.tags
    logger.warn "tags: #{tags}"
    tags.each {|tag| tag.tag_name}
    @task.destroy
    deletedTags = tags.select {|tag| tag.tasks.length() == 0}
    deletedTags.each {|tag| tag.destroy}
    logger.warn "deletedTags: #{deletedTags}"
    if @task.destroy
        # head :no_content, status: :ok
        render json: {:deletedTags => deletedTags}
      else
        render json: @task.errors, status: :unprocessable_entity
      end  
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_task
      @task = Task.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def task_params
      params.require(:task).permit(:description, :notes, :completed)
    end
end
