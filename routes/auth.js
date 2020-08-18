const express = require('express')
const router = express.Router()

const { wrapAsync, authenticateUser } = require('../middleware/functions')
const { checkUser } = require('../middleware/queries')

/**
 * @route POST /auth
 * @desc Authenticate the user
 * @access Public
 */
router.post('/', wrapAsync(async (request, response) => {
  let { email, password } = request.body
  email = email.toLowerCase()

  const user = await checkUser(email, password)
  if (!user) throw new Error('invalidUserError')
  
  const token = await authenticateUser(user, password)

  response.json({
    token: token,
    user: {
      email: user.email
    }
  })
}))

module.exports = router;
