const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const dbPool = require('../config/database')
const keys = require('../config/keys.json')

/**
 * @route POST /auth
 * @desc Authenticate the user
 * @access Public
 */
router.post('/', async (request, response) => {
  const { email, password } = request.body

  if (!email || !password) {
    return response.status(400).json({ msg: 'Please enter all fields.' })
  }

  const query = 'SELECT * FROM user WHERE email = ?'
  let rows, fields
  try {
    [rows, fields] = await dbPool.query(query, email)
  }
  catch (error) {
    console.log(error)
    return response.status(502).json({ msg: 'A database error occurred; could not verify user.' })
  }

  if (!rows[0]) {
    return response.status(400).json({ msg: 'User does not exist.' })
  }
  const user = rows[0]

  let match
  try {
    match = await bcrypt.compare(password, user.password)
  }
  catch (error) {
    console.log(error)
    return response.status(500).json({ msg: 'Could not verify user.' })
  }

  if (!match) return response.status(400).json({ msg: 'Invalid credentials.' })

  const token = jwt.sign({ id: user.uid }, keys.jwtSecret, { expiresIn: 3600 })

  response.json({
    token: token,
    user: {
      id: user.uid,
      email: user.email
    }
  })
})

module.exports = router;
