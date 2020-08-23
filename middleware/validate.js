const { query, validationResult } = require('express-validator')

async function checkApiQuery(request, response, next) {
  await Promise.all([
    query('query')
      .isString()
      .trim()
      .notEmpty()
      .escape()
      .run(request),
    query('page')
      .optional()
      .isInt()
      .run(request)
  ])
  
  const errors = validationResult(request)
  errors.throw()

  next()
}

module.exports = {
  checkApiQuery
}
