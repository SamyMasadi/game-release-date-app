const express = require('express')
const router = express.Router()

const { wrapAsync, authenticateUser } = require('../middleware/functions')
const { getUserByEmail } = require('../middleware/queries')
const { checkLoginVars } = require('../middleware/validate')

/**
 * @route POST /auth
 * @desc Authenticate the user
 * @access Public
 */
router.post('/', wrapAsync(checkLoginVars), wrapAsync(async (request, response) => {
  let { email, password } = request.body

  const user = await getUserByEmail(email)
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
