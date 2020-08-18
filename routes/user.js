const express = require('express')
const router = express.Router()

const { wrapAsync, checkAuth } = require('../middleware/functions')
const { checkUser, registerUser, getUserByID } = require('../middleware/queries')

/**
 * @route POST /user
 * @desc Register new user
 * @access Public
 */
router.post('/', wrapAsync(async (request, response) => {
  let { email, password } = request.body
  email = email.toLowerCase()

  const user = await checkUser(email, password)
  if (user) throw new Error('preExistingUserError')

  const token = await registerUser(email, password)

  response.json({
    token,
    user: {
      email
    }
  })
}))

/**
 * @route GET /user
 * @desc Get user data
 * @access Private
 */
router.get('/', wrapAsync(checkAuth), wrapAsync(async (request, response) => {
  const user = await getUserByID(request.user.id)
  response.json(user)
}))

module.exports = router;
