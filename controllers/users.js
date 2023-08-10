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
}
//.OLDER SYNTAX to the above code block:
//   pool.query("SELECT * FROM users", (err, rows) => {
//     if (err) return handleSQLError(res, err)
//     return res.json(rows);
//   })
// }

const getUserById = (req, res) => {
  // SELECT USERS WHERE ID = <REQ PARAMS ID>
  let id = req.params.id
  let params = [id]

  let sql = "SELECT * FROM users u "
  sql += "JOIN usersAddress ua ON u.id = ua.user_id "
  sql += "JOIN usersContact uc ON u.id = uc.user_id "
  sql += "AND u.id = ?" 



  // WHAT GOES IN THE BRACKETS
  db.query(sql, params, (err, rows) => {
    if (err){
      console.log("getUserById query failed", err)
      res.sendStatus(400)
    } else {
      res.json(rows);
    }
  })
}


//OLDER SYNTAX:  
//   sql = mysql.format(sql, [])

//   pool.query(sql, (err, rows) => {
//     if (err) return handleSQLError(res, err)
//     return res.json(rows);
//   })
// }

const createUser = (req, res) => {

  //FIRST QUERY -> INSERT INTO USERS FIRST AND LAST NAME 
  let first = req.body.first_name
  let last = req.body.last_name

  let params = [first, last]
  let sql = "INSERT INTO users (first_name, last_name) VALUES (?, ?)"

  let results

  try {
    results = await db.querySync(sql, params)
  } catch(err) {
    console.log("createUser query failed ", err)
    res.sendStatus(500)
    return // if query didn't work, stop
  }

  let id = results.insertId


  //SECOND QUERY -> INSERT INTO usersAddress: user ID, address, city, county, state, zip

  let address = req.body.address
  let city = req.body.city
  let county =  req.body.county
  let state = req.body.state
  let zip = req.body.zip

  params = [id, address, city, county, state, zip]
  sql = "INSERT INTO usersAddress (user_id, address, city, county, state, zip) VALUES (?, ?, ?, ?, ?, ?)"

  try {
    results = await db.querySync(sql, params)
  } catch(err) {
    console.log("createUser address query failed ", err)
    res.sendStatus(500)
    return
  }


  //THIRD QUERY -> INSERT INTO usersContact: user ID, phone1, phone2, email
  let phone1 = req.body.phone1
  let phone2 = req.body.phone2
  let email = req.body.email
  
  params = [id, phone1, phone2, email]
  sql = "INSERT INTO usersContact (user_id, phone1, phone2, email) VALUES (?, ?, ?, ?)"

  try {
    results = await db.querySync(sql, params)
  } catch(err) {
    console.log("createUser contact query failed ", err)
    res.sendStatus(500)
    return
  }

}









/**
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */
const updateUserById = (req, res) => {
  // UPDATE USERS AND SET FIRST AND LAST NAME WHERE ID = <REQ PARAMS ID>
  let id = req.params.id
  let first = req.body.first_name
  let last = req.body.last_name
  let params = [first, last, id]

  let sql = "UPDATE users u "
  sql += "SET first_name = ?, last_name = ? "
  sql += "WHERE id = ?"

  if(!id){
    res.sendStatus(400)
    return
  }

  // WHAT GOES IN THE BRACKETS
  db.query(sql, params, (err, rows) => {
    if (err){
      console.log("updateUserById query failed", err)
      res.sendStatus(400)
    } else {
      res.json(rows);
    }
  })
}



//   //OLDER SYNTAX:
//   sql = mysql.format(sql, [])

//   pool.query(sql, (err, results) => {
//     if (err) return handleSQLError(res, err)
//     return res.status(204).json();
//   })
// }




const deleteUserByFirstName = (req, res) => {
  // DELETE FROM USERS WHERE FIRST NAME = <REQ PARAMS FIRST_NAME>
  let first = req.params.first_name
  let params = [first]

  let sql = "DELETE FROM users WHERE first_name = ?"




  // WHAT GOES IN THE BRACKETS
  if(!first){
    res.sendStatus(400)
    return
  }

  db.query(sql, params, (err, rows) => {
    if (err){
      console.log("deleteUserByFirstName query failed", err)
      res.sendStatus(400)
    } else {
      res.json({ message: `Deleted ${rows.affectedRows} user(s)`});
    }
  })
}

//   //OLDER SYNTAX:
//   sql = mysql.format(sql, [])

//   pool.query(sql, (err, results) => {
//     if (err) return handleSQLError(res, err)
//     return res.json({ message: `Deleted ${results.affectedRows} user(s)` });
//   })
// }

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserByFirstName
}