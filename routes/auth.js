const express = require('express')
const router = express.Router()

const { wrapAsync, checkUser, getUserByID, authenticateUser } = require('../middleware/functions')
const auth = require('../middleware/auth')

/**
 * @route POST /auth
 * @desc Authenticate the user
 * @access Public
 */
router.post('/', wrapAsync(async (request, response) => {
  const { email, password } = request.body

  const user = await checkUser(email, password)
  if (!user) throw new Error('invalidUserError')
  
  const token = await authenticateUser(user, password)

  response.json({
    token: token,
    user: {
      id: user.uid,
      email: user.email
    }
  })
}))

/**
 * @route GET /auth/user
 * @desc Get user data
 * @access Private
 */
router.get('/user', auth, wrapAsync(async (request, response) => {
  const user = await getUserByID(request.user.id)
  response.json(user)
}))

module.exports = router;
