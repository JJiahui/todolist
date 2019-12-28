class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.string :description
      t.text :notes
      t.boolean :completed

      t.timestamps
    end
  end
end
