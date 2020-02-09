# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Task.all.each {|t| t.destroy}
Tag.all.each {|t| t.destroy}
Time.zone = 'Singapore'

task1 = Task.create(description: "Meditate 10min before sleep", notes: "Use new app", due_date: Date.parse("2021-01-01"), due_time: Date.parse("2021-01-01"))
tag1 = task1.tags.create(:tag_name => "Health")
task1.tags.create(:tag_name => "Relax")
task2 = Task.create(description: "Eat fruits")
task2.tags << tag1
task2.tags.create(:tag_name => "Food")
Task.create(description: "Do nothing", notes: "I need some boredom", due_date: Time.now.to_date + 1.days - 1.seconds)
Task.create(description: "New Year", due_date: Date.parse("2020-01-01"))