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

  const json = await fs.readFile('config/keys.json', 'utf-8')
  const { jwtSecret } = JSON.parse(json)
  const decoded = jwt.verify(token, jwtSecret)
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
  
  const json = await fs.readFile('config/keys.json', 'utf-8')
  const { jwtSecret } = JSON.parse(json)
  const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: 3600 })
  return token
}

module.exports = {
  wrapAsync,
  checkAuth,
  authenticateUser
}
