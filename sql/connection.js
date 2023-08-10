require('dotenv').config();

const mysql = require('mysql')

let connection = mysql.createConnection(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
  }
);

// make connection
connection.connect();

// make async call to test connection
connection.query("select now()", (err, rows) => {
  if (err){
    console.log("Connection NOT successful", err)
  } else {
    console.log("Connection successful, ", rows)
  }
}
);

module.exports = connection;


/** Breakout of above code block
 * use the basic syntax of the mySQL module query
 * 
 * execute the query and handle the result
 * connection.query(sql, callback)
 *   sql = query code you want to run - select * from wherever
 *   callback = does what you want to do with the results
 */

/** 
 let sql = 'select now()';
 let callback = (err, rows) =>{
   if (err) {
     // not truthy, so a connection wasn't made
     console.log("Connect NOT successful", err)
   } else {
     // IS truthy, so the query executed; query output is provided
     console.log("Connection Successful!", rows)
   }
 }
*/


// (OLDER METHOD) Class-based connection :
// const mysql = require("mysql")
//
// class Connection {
//   constructor() {
//     if (!this.pool) {
//       console.log('creating connection...')
//       this.pool = mysql.createPool({
//         connectionLimit: 100,
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PWD,
//         database: process.env.DB_NAME
//       })

//       return this.pool
//     }

//     return this.pool
//   }
// }

// const instance = new Connection()

// module.exports = instance;