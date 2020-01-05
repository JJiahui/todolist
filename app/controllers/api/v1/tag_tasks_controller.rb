class Api::V1::TagTasksController < ApplicationController
  before_action :set_tag_task, only: [:show, :update, :destroy]

  # GET /tag_tasks
  def index
    @tag_tasks = TagTask.all

    render json: @tag_tasks
  end

  # GET /tag_tasks/1
  def show
    render json: @tag_task
  end

  # POST /tag_tasks
  def create
    @tag_task = TagTask.new(tag_task_params)

    if @tag_task.save
      render json: @tag_task, status: :created
      # render json: @tag_task, status: :created, location: @tag_task
    else
      render json: @tag_task.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /tag_tasks/1
  def update
    if @tag_task.update(tag_task_params)
      render json: @tag_task
    else
      render json: @tag_task.errors, status: :unprocessable_entity
    end
  end

  # DELETE /tag_tasks/1
  def destroy
    @tag_task.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_tag_task
      @tag_task = TagTask.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def tag_task_params
      params.require(:tag_task).permit(:tag_id, :task_id)
    end
end
