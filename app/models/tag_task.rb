class TagTask < ApplicationRecord
  belongs_to :tag
  belongs_to :task
  # before_destroy :on_destroy
  # def on_destroy
  #   self.tag.destroy if self.tag.tasks.length() == 1
  # end
end
