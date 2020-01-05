Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do 
      resources :tasks, :tags, :tag_tasks
      delete '/tag_tasks', to: 'tag_tasks#destroy_tag_task'
    end
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

end
