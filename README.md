# JS311_wk4_day2_node_mysql
# MySQL + Express


We're going to update this project to user newer modules and syntax

1. In BeeKeeper or MySQL Workbench, connect to the database and run the `initialize.sql` script that is included in this project.

2. delete package.json and package-lock.json (also delete node_modules if you already installed)

3. create a new package.json to use latest versions of:
    devDependencies
        nodemon
    dependencies
        express
        mysql
        dotenv
    add start and dev commands to "scripts"

4. npm install

5. create a .env file and add your db creds
    add to .gitignore

6. create a public folder
    add index.html  -- come back and ! link the stylesheet and add h1 'It works'
    add index.css

7. index.js
    *REMOVED: require path*
    remove bodyParser
    add app.use(express.json());
    add app.use(express.static('public'));
    *REMOVED:remove app.get 'Welcome to our server'*
    add app.get with res.sendFile to go to public index.html

8. create a .env file
   add your db creds

9. connection.js
    require('dotenv').config()
    add your db creds variables

10. test to make sure get /users works


///////////////////OLD VERSION BELOW///////////////////
## Setup
Initialize and run the app: `npm install` && `npm start`.

The app is using `nodemon`. Any changes made (and saved) will cause the server to restart.

Navigate to the `sql/connections.js` file and alter the following fields to reflect your database setup:

```
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'admin'
```

These will be the same credentials we used to set up a connection in MySQL Workbench.

Finally, in MySQL Workbench, run the `initialize.sql` script that is included in this project.

## Overview

The routes/controllers and basic setup has been done for us. Our job is now to complete the queries in `controllers/users.js`. There are five different controller functions and the first one has been done for us. We should be able to see this by navigating to: http://localhost:4001/users/ 

Keep in mind that your port (4001) may be different.

Take another look in the `sql/connections.js` file and notice how we set up the class to pass the same connection pool to any file that requests it. 

Additionally, navigate to the `initialize.sql` file and look at the CREATEs for the three tables. Do we notice anything different this time around? How about the `ON DELETE CASCADE` line? Remember last time when we couldn't delete a row from the users table because the usersContact and usersAddress were still dependent on it? That no longer applies with CASCADE. Now when we delete something from the users table it will automatically be deleted from the other two tables based on the foreign key relationship. 

## Controller functions

### getAllUsers

This function is done for us. Notice the SQL statement retrieving all the rows from the users table.

### getUserById

The route is going to look like this: http://localhost:4001/users/389

Where 389 is the `:id` parameter in the route. Our job is to select just the row that matches that id and return it. Write a SELECT statement WHERE id = the req param id

Look at the following line where it says `mysql.format()`. What do you think goes in those brackets? Hint.. it's the req param id

### createUser

The route is going to look like this: http://localhost:4001/users/

We are going to need to use Postman to access this route since it is now a POST request. 

We are going to send a body with the request that looks like this:

```
{
  first_name: 'bogus',
  last_name: 'user'
}
```

Or any fake user of your choice. The goal is to take the request body and insert it into the database. You will write a query to INSERT INTO users (fields) VALUES ()

Again we will need to figure out what goes in the brackets

### updateUserById

The route is going to look like this: http://localhost:4001/users/234

Which is similar to the GET route but this time it is a PUT. We will need to use Postman again to make this work. 

The goal of this route is to again send a body and this time change the first_name and last_name fields for the row that matches that id. The body for this request will remain the same as last time: 

```
{
  first_name: 'bogus',
  last_name: 'user'
}
```

Write a SQL statement to UPDATE users SET fields = values WHERE id = req param id

### deleteUserByFirstName

This route will look like this: http://localhost:4001/users/bogus

But it will be using the DELETE protocol so again we will need to use Postman to achieve this.

Write a SQL statement to DELETE FROM users WHERE first_name = req param first_name

### Create a full Query

- In your `getAllUsers` return all fields of all users including the fields of `usersContact` & `usersAddress`
- In your `createUser` be sure that a complete user is created inluding all fields in `usersContact` & `usersAddress`

## Summary

If all went according to plan we now have a full CRUD API that selects, inserts, updates and deletes from a SQL database. Great job! Take the time to start expanding on these concepts. 
