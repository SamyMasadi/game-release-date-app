const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const dbPool = require('../config/database')
const keys = require('../config/keys.json')

/**
 * Enables async functions to successfully pass errors to Express error handlers.
 * @param {Function} fn An async function
 * @return The wrapped async function
 */
function wrapAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }  
}

/**
 * Queries the database for an existing user.
 * @param {string} email The user's email
 * @param {string} password The user's password
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
 * @param {string} id The user's id
 * @return The queried user object
 */
async function getUserByID(id) { 
  const query = 'SELECT uid, email, register_date FROM user WHERE uid = ?'
  const [rows, fields] = await dbPool.query(query, id)

  return rows[0]
}

/**
 * Adds a new user to the database then responds with a JSON web token.
 * @param {string} email The user's email
 * @param {string} password The user's password
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

/**
 * Checks the user's password then responds with a JSON web token.
 * @param {Object} user The user object returned from the database
 * @param {string} unhashedPassword The password submitted by the user
 * @return A JSON web token
 */
async function authenticateUser(user, unhashedPassword) {
  const match = await bcrypt.compare(unhashedPassword, user.password)
  if (!match) {
    throw new Error('invalidCredentialsError')
  }
  
  const token = jwt.sign({ id: user.uid }, keys.jwtSecret, { expiresIn: 3600 })
  return token
}

module.exports = {
  wrapAsync,
  checkUser,
  getUserByID,
  registerUser,
  authenticateUser
}