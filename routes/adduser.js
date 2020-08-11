const express = require('express')
const router = express.Router()

const { wrapAsync } = require('../middleware/functions')
const { checkUser, registerUser } = require('../middleware/queries')

/**
 * @route POST /adduser
 * @desc Register new user
 * @access Public
 */
router.post('/', wrapAsync(async (request, response) => {
  const { email, password } = request.body

  const user = await checkUser(email, password)
  if (user) throw new Error('preExistingUserError')

  const { token, id } = await registerUser(email, password)

  response.json({
    token,
    user: {
      id,
      email
    }
  })
}))

module.exports = router;
