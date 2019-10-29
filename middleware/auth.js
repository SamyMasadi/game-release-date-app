const jwt = require('jsonwebtoken')

const keys = require('../config/keys.json')

function auth(request, response, next) {
  const token = request.header('x-auth-token')
  if (!token) throw new Error('noTokenError')

  const decoded = jwt.verify(token, keys.jwtSecret)
  request.user = decoded
  next()
}

module.exports = auth
