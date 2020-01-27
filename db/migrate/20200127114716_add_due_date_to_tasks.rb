class AddDueDateToTasks < ActiveRecord::Migration[6.0]
  def change
    add_column :tasks, :due_date, :date
    add_column :tasks, :due_time, :datetime
  end
end
