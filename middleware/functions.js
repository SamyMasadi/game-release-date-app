const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const keys = require('../config/keys.json')

/**
 * Enables async functions to successfully pass errors to Express error handlers.
 * @param fn An async function
 * @return The wrapped async function
 */
function wrapAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }  
}

function checkAuth(request, response, next) {
  const token = request.header('x-auth-token')
  if (!token) throw new Error('noTokenError')

  const decoded = jwt.verify(token, keys.jwtSecret)
  request.user = decoded
  next()
}

/**
 * Checks the user's password then responds with a JSON web token.
 * @param user The user object returned from the database
 * @param unhashedPassword The password submitted by the user
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
  checkAuth,
  authenticateUser
}