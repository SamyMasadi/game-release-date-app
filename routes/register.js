const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const dbPool = require('../config/database')
const keys = require('../config/keys.json')

/**
 * @route POST /register
 * @desc Register new user
 * @access Public
 */
router.post('/', checkUser, registerUser)

/**
 * Queries the database for an existing user.
 * @param {Object} request An HTML request
 * @param {Object} response An HTML response
 * @param {Object} next Tells router to call the next function
 */
async function checkUser(request, response, next) {
  const { email, password } = request.body

  if (!email || !password) {
    return response.status(400).json({ msg: 'Please enter all fields.' })
  }

  const query = 'SELECT * FROM user WHERE email = ?'
  let rows, fields
  try {
    [rows, fields] = await dbPool.query(query, email)
    if (rows[0]) {
      return response.status(400).json({ msg: 'User already exists.' })
    }
  }
  catch (error) {
    console.log(error)
    return response.status(502).json({ msg: 'A database error occurred: could not verify user.' })
  }

  next()
}

/**
 * Adds a new user to the database then responds with a JSON web token.
 * @param {Object} request An HTML request
 * @param {Object} response An HTML response
 */
async function registerUser(request, response) {
  const { email, password } = request.body

  const saltRounds = 10
  let salt, hash
  try {
    salt = await bcrypt.genSalt(saltRounds)
    hash = await bcrypt.hash(password, salt)
  }
  catch (error) {
    console.log(error)
    return response.status(500).json({ msg: 'Failed to register user' })
  }

  let result, fields
  const query = 'INSERT INTO user (email, password) VALUES (?, ?)'
  try {
    [result, fields] = await dbPool.query(query, [email, hash])
  }
  catch (error) {
    console.log(error)
    return response.status(502).json({ msg: 'A database error occurred: failed to register user.'})
  }

  const token = jwt.sign({ id: result.insertId }, keys.jwtSecret, { expiresIn: 3600 })

  response.json({
    token: token,
    user: {
      id: result.insertId,
      email: email
    }
  })
}

module.exports = router;
