## CVWO final submission

- Name: Jiang Jiahui
- Matric No: A0185088R

Versions
- Ruby 2.6.5
- Rails 6.0.2.1

#### To run:

Navigate to `/frontend` directory, and do
```
yarn install
```

Go back to the root of the project, and do
```
bundle install
rake db:migrate
rake db:seed
foreman start -f Procfile.dev # make sure the foreman gem is installed
```

[Click here for demo.](https://todolist-jjiahui.herokuapp.com)