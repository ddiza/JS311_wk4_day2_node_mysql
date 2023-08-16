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

// mySQL module doesn't include a method that handles promises, -just callbacks.
// The database doesn't care. It just receives queries, processes it, and returning results.
// If we want to use promises, either find a module that handles mySQL promises (and learn to use it)
//   or we can build our own middleware function that does it for us.

// **BASIC WRAPPER PROMISE** if you just want to convert a callback to a promise.
// Used when we build our authorization project:
connection.queryPromise = (sql, params) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, rows) => {
      if(err) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  })
};

// To go farther, if you want to process the results of your promise and return the results
//   you want to make a blocking function that always returns an err or rows.
connection.querySync = async (sql, params) => {
  let promise = new Promise((resolve, reject) => {
    console.log("Executing query", sql);
    connection.query(sql, params, (err, rows) => {
      if(err){
        console.log("rejecting");
        return reject(err);
      } else {
        console.log("resolving");
        return resolve(results);
      }
    })
  })

  let results = await promise.then((results) => {
    console.log("results ", results);
    return results;
  }).catch((err) => {
    throw err;
  })
  return results;
};


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