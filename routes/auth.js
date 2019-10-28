const express = require('express')
const router = express.Router()

const { wrapAsync, checkUser, authenticateUser } = require('../middleware/functions')

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

module.exports = router;
