const { body, query, validationResult } = require('express-validator')

async function checkApiQuery(request, response, next) {
  await Promise.all([
    query('query')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('The search term cannot be empty.')
      .escape()
      .run(request),
    query('page')
      .optional()
      .isInt()
      .withMessage('The page value must be a valid number.')
      .run(request)
  ])
  
  const errors = validationResult(request)
  errors.throw()
  next()
}

async function checkUserVars(request, response, next) {
  await Promise.all([
    body('email')
      .isEmail()
      .withMessage('The value must be a valid email.')
      .normalizeEmail({ all_lowercase: true })
      .run(request),
    body('password')
      .isString()
      .isLength({ min: 8, max: undefined })
      .withMessage('The password must be at least 8 characters long.')
      .custom(value => /[a-z]/.test(value))
      .withMessage('The password must contain a lowercase letter.')
      .custom(value => /[A-Z]/.test(value))
      .withMessage('The password must contain an uppercase letter.')
      .custom(value => /\d/.test(value))
      .withMessage('The password must contain a number.')
      .run(request)
  ])

  const errors = validationResult(request)
  errors.throw()
  next()
}

async function checkLoginVars(request, response, next) {
  await Promise.all([
    body('email')
      .isEmail()
      .withMessage('The value must be a valid email.')
      .normalizeEmail({ all_lowercase: true })
      .run(request),
    body('password')
      .isString()
      .run(request)
  ])

  const errors = validationResult(request)
  errors.throw()
  next()
}

module.exports = {
  checkApiQuery,
  checkUserVars,
  checkLoginVars
}
