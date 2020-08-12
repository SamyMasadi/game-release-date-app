const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs').promises

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

async function checkAuth(request, response, next) {
  const token = request.header('x-auth-token')
  if (!token) throw new Error('noTokenError')

  const keysFile = 'keys.json'
  const keys = await readConfig(keysFile)
  const decoded = jwt.verify(token, keys.jwtSecret)
  request.user = decoded
  next()
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

/**
 * Asynchronously reads a JSON config file from /config/ and parses the JSON data.
 * @param {string} file The file name
 * @return An object from JSON
 */
async function readConfig(file) {
  const path = './config/' + file
  const json = await fs.readFile(path, 'utf-8')
  const jsonData = JSON.parse(json)
  return jsonData
}

module.exports = {
  wrapAsync,
  checkAuth,
  authenticateUser,
  readConfig
}