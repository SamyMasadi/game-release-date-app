const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs').promises

const User = require('../models/User')
const ApiResult = require('../models/ApiResult')

const db = mongoose.connection
db.once('open', () => { console.log('MongoDB connnected...') })
db.once('disconnected', () => { console.log('MongoDB disconnected...') })
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

async function getApiResults(query, page) {
  const apiResults = await ApiResult.findOne({ query, page }).exec()
  return apiResults
}

async function saveApiResults(query, page, results, savedResults) {
  const query_page = query + '_' + page
  let newResults = { query_page, query, page, results }
  if (savedResults) {
    newResults.date = Date.now()
    savedResults.overwrite(newResults)
    return await savedResults.save()
  }
  const newApiResult = new ApiResult(newResults)
  await newApiResult.save()
}

/**
 * Queries the database for an existing user.
 * @param {string} email The user's email
 * @return The queried user object
 */
async function getUserByEmail(email) {
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
  getApiResults,
  saveApiResults,
  getUserByEmail,
  getUserByID,
  registerUser
}
