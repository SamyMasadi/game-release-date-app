const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs').promises

const User = require('../models/User')

const db = mongoose.connection
db.once('open', () => { console.log('MongoDB connnected...') })
connectDB().catch(error => console.error(error))

async function connectDB() {
  const json = await fs.readFile('config/database.json', 'utf-8')
  const { host,user,password,database } = JSON.parse(json)
  const mongoURI = 'mongodb://'+user+':'+password+'@'+host+'/'+database
  const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }
  await mongoose.connect(mongoURI, dbOptions)
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

  const user = await User.findOne({ email: email }).exec()
  return user
}

/**
 * Queries the database for an existing user.
 * @param {Object} id The user's id
 * @return The queried user object
 */
async function getUserByID(id) {
  const user = await User.findOne({ _id: id }).select('_id email watch_list').exec()
  return user
}

/**
 * Adds a new user to the database then responds with a JSON web token.
 * @param {string} email The user's email
 * @param {string} password The user's password
 * @return A JSON web token
 */
async function registerUser(email, password) {
  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(password, salt)

  const newUser = new User({
    email: email,
    password: hash
  })
  const { _id } = await newUser.save()

  const json = await fs.readFile('config/keys.json', 'utf-8')
  const { jwtSecret } = JSON.parse(json)
  const token = jwt.sign({ id: _id }, jwtSecret, { expiresIn: 3600 })
  return token
}

module.exports = {
  checkUser,
  getUserByID,
  registerUser
}
