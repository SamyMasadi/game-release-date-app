const mysql = require('mysql2')

const dbConfig = require('../config/database.json')
const keys = require('../config/keys.json')

let dbPool = mysql.createPool(dbConfig)
dbPool = dbPool.promise()

/**
 * Queries the database for an existing user.
 * @param email The user's email
 * @param password The user's password
 * @return The queried user object
 */
async function checkUser(email, password) {  
  if (!email || !password) {
    throw new Error('formValidationError')
  }

  const query = 'SELECT * FROM user WHERE email = ?'
  const [rows, fields] = await dbPool.query(query, email)

  return rows[0]
}

/**
 * Queries the database for an existing user.
 * @param id The user's id
 * @return The queried user object
 */
async function getUserByID(id) { 
  const query = 'SELECT uid, email, register_date FROM user WHERE uid = ?'
  const [rows, fields] = await dbPool.query(query, id)

  return rows[0]
}

/**
 * Adds a new user to the database then responds with a JSON web token.
 * @param email The user's email
 * @param password The user's password
 * @return An object containing a JSON web token and the user's id
 */
async function registerUser(email, password) {
  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(password, salt)

  const query = 'INSERT INTO user (email, password) VALUES (?, ?)'
  const [response, fields] = await dbPool.query(query, [email, hash])
  
  const token = jwt.sign({ id: response.insertId }, keys.jwtSecret, { expiresIn: 3600 })

  return { 
    token: token,
    id: response.insertId
  }
}

module.exports = {
  checkUser,
  getUserByID,
  registerUser
}
