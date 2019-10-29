const BAD_REQUEST = 400
const UNAUTHORIZED = 401
const INTERNAL_SERVER_ERROR = 500
const SERVICE_UNAVAILABLE = 503

function logErrors(err, req, res, next) {
  console.error(err)
  next(err)
}

function clientErrorHandler(err, req, res, next) {
  if (err.message === 'formValidationError') {
    return res.status(BAD_REQUEST).json({ message: 'Please enter all fields.' })
  }

  if (err.message === 'invalidUserError') {
    return res.status(BAD_REQUEST).json({ message: 'User does not exist.' })
  }

  if (err.message === 'preExistingUserError') {
    return res.status(BAD_REQUEST).json({ message: 'User already exists.' })
  }
  
  if (err.message === 'invalidCredentialsError') {
    return res.status(BAD_REQUEST).json({ message: 'Invalid credentials.' })
  }

  if (err.message === 'noTokenError') {
    return res.status(UNAUTHORIZED).json({ message: 'No token, authorization denied.' })
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(BAD_REQUEST).json({ message: 'Token is not valid.' })
  }  

  next(err)
}

function apiErrorHandler(err, req, res, next) {
  if (err.isAxiosError) {
    return res.status(SERVICE_UNAVAILABLE).json({ message: 'The game search API is unavailable.' })
  }

  next(err)
}

function databaseErrorHandler(err, req, res, next) {
  if (err.errno === 'ECONNREFUSED') {
    return res.status(SERVICE_UNAVAILABLE).json({ message: 'A database error occurred.' })
  }
  
  next(err)
}

function defaultErrorHandler(err, req, res, next) {
  res.status(INTERNAL_SERVER_ERROR).json({ message: 'Internal server error.' })
}

module.exports = {
  logErrors,
  clientErrorHandler,
  apiErrorHandler,
  databaseErrorHandler,
  defaultErrorHandler
}
