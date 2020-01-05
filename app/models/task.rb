class Task < ApplicationRecord
    before_create :init
    has_many :tag_tasks, dependent: :destroy
    has_many :tags, through: :tag_tasks
    def init
        self.completed = false if self.completed.nil?
    end
end
