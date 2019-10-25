const jwt = require('jsonwebtoken')

const keys = require('../config/keys.json')

function auth(request, response, next) {
  const token = request.header('x-auth-token')
  if (!token) response.status(401).json({ msg: 'No token, authorization denied.' })
  try {
    const decoded = jwt.verify(token, keys.jwtSecret)
    request.user = decoded
    next()
  }
  catch (error) {
    console.log(error)
    response.status(400).json({ msg: 'Token is not valid.' })
  }  
}

module.exports = auth
