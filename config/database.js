const mysql = require('mysql2')

let dbPool = mysql.createPool({
  host: '',
  user: '',
  password: '',
  database: '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

dbPool = dbPool.promise()

module.exports = dbPool
