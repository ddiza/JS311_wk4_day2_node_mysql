const mysql = require('mysql')
const db = require('../sql/connection')
const { handleSQLError } = require('../sql/error')

const getAllUsers = (req, res) => {
  // From workbench/beekeeper:
  // SELECT first_name, last_name, address, city, county, state, zip, phone1, phone2, email FROM users u JOIN usersAddress ua on u.id = ua.user_id JOIN usersContact uc on u.id = uc.user_id

  let sql = "SELECT first_name, last_name, address, city, county, state, zip, phone1, phone2, email "
  sql += "FROM users u "
  sql += "JOIN usersAddress ua on u.id = ua.user_id "
  sql += "JOIN usersContact uc on u.id = uc.user_id"
  
  db.query(sql, (err, rows) => {
    if(err){
      console.log("getAllUsers query failed", err)
      res.sendStatus(500) //issue with server
    } else{
      return res.json(rows);
    }
  })

// OLDER SYNTAX replaced by above code block:
//   pool.query("SELECT * FROM users", (err, rows) => {
//     if (err) return handleSQLError(res, err)
//     return res.json(rows);
//   })
// }
}


const getUserById = (req, res) => {
  // SELECT USERS WHERE ID = <REQ PARAMS ID>
  // users/:id
  // put the requested pat id into a variable

  let id = req.params.id //This gets wtv is sent from front-end form in id text field.
  let params = [id]; // You can have more than one ? in your query &  must be in order of use in the query.
  
  // CHECK FOR VALID ID
  if(!id){
    res.sendStatus(400); // user fault; didn't send valid id
    return;              // and stop. no reason to execute further
  }

  // THE FOLLOWING IS IS A BAD WAY TO DO A QUERY: 
  // with the id (or any request param) concatinated to the string.
  // WHY? If I add and drop table users.
  // This is called a SQL Injection Attack
  // let sql = "SELECT first_name, last_name, address, city, county, state, zip, phone1, phone2, email "
  // sql += "FROM users u "
  // sql += "JOIN usersAddress ua on u.id = ua.user_id "
  // sql += "JOIN usersContact uc on u.id = uc.user_id"
  // sql += "where u.id = " + id;

  // Instead, we use parameterized sql statements
  let sql = "SELECT first_name, last_name, address, city, county, state, zip, phone1, phone2, email "
  sql += "FROM users u "
  sql += "JOIN usersAddress ua on u.id = ua.user_id "
  sql += "JOIN usersContact uc on u.id = uc.user_id"
  sql += "where u.id = ?"; 
  // The ? is a dynamic value, restricted to query parameter.
  // The query param isn't combined with the main query until after the query has been 
  // parsed. So there's no way the parameter can introduce unintended syntax.

  db.query(sql, params, (err,rows) => {
    if (err){
      console.log("getUserById query failed ", err)
      res.sendStatus(500); // It was our fault; could be db.
    } else {
      // we got results, but we got more than one row
      if(rows.length > 1){
        console.log("Returned more than 1 row for id ", id);
        res.sendStatus(500); // data integrity
      } else if(rows.length == 0){
        res.send(null); //don't send anything back
        // OR
        res.status(404).send('User not Found');
      } else {
        // success -> We got one row.
        res.json(rows[0]) // if return just res.json(rows), it returns an array with one object
                      // if I want to return just the array, I need to reference the index
      }
    }

  })
// OLDER SYNTAX - WILL NO LONGER USE:
// WHAT GOES IN THE BRACKETS
//   sql = mysql.format(sql, [])

//   pool.query(sql, (err, rows) => {
//     if (err) return handleSQLError(res, err)
//     return res.json(rows);
//   })
// }
}

const createUser = (req, res) => {
  // INSERT INTO USERS FIRST AND LAST NAME - when the id is created that we need for the user_id columns in the other two tables
  // So, the first insert MUST complete before we can execute the other 2 queries.
  // INSERT INTO usersContact user_id, phone1, phone2, email
  // INSERT INTO usersAddress user_id, address, city, county, state, zip

  // async run something until it finishes whenever, and goes on to run other stuff 
  // while that first thing may or may not be finished.
  // Sometimes you need code to run in a certain order (like fetch & promises)
  // This is called BLOCKING CODE sometimes.

  // Here's the kicker: mySQL doesn't have built-in methods to create blocking code out of the box.

  // One way we handle this is to create nested callbacks that execute each query one at a time
  // This can get complicated. We call this scenario Callback Hell.

  // CALLBACK HELL VERSION

  // FIRST QUERY
  let first = req.body.first_name;
  let last = req.body.last_name;
  let params = [first, last];

  //I could also do this, but sometimes it gets long
  // let params = [req.body.first_name, req.body.last_name]
  let sql = "insert into users (first_name, last_name) values (?, ?)";

  db.query(sql, params, (err,rows) => {
    if(err){
      console.log("createUser query failed ", err);
      res.sendStatus(500);
    } else {
      // If we got here, the first query executed
      // postman check
      
      // SECOND QUERY
      // I need the ID of the user we just inserted. For this example, I'm might have to use MAX() to get the id
      let getId = rows.insertId;

      let address = req.body.address;
      let city = req.body.city;
      let county = req.body.county;
      let state = req.body.state;
      let zip = req.body.zip;

      params = [getId, address, city, county, state, zip]

      sql = "insert into usersAddress (user_id, address, city, county, state, zip) ";
      sql += "values (?,?,?,?,?,?)";

      db.query(sql, params, (err,rows) => {
        if(err){
          console.log("insert into usersAddress query failed ", err)
        } else {
          // second query worked
          // postman check
          // res.json(rows);

          //THIRD QUERY
        }
      })
      

    }
  })
}

const updateUserById = (req, res) => {
  // UPDATE USERS AND SET FIRST AND LAST NAME WHERE ID = <REQ PARAMS ID>
  let sql = ""
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.status(204).json();
  })
}

const deleteUserByFirstName = (req, res) => {
  // DELETE FROM USERS WHERE FIRST NAME = <REQ PARAMS FIRST_NAME>
  let sql = ""
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ message: `Deleted ${results.affectedRows} user(s)` });
  })
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserByFirstName
}



