class Task < ApplicationRecord
    before_create :init
    def init
        self.completed = false if self.completed.nil?
    end
end
