const express = require('express')
const app = express()
const path = require('path')

const { logErrors, clientErrorHandler, apiErrorHandler, databaseErrorHandler, defaultErrorHandler } = require('./middleware/error')

app.use(express.static('./client/build'))

// Body Parser middleware
app.use(express.json())

////////////////
//   Routes   //
////////////////
app.use('/api', require('./routes/api'))
app.use('/adduser', require('./routes/adduser'))
app.use('/auth', require('./routes/auth'))

app.get('/*', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})

//////////////////////////////////////////
//            Error Handlers            //
//  Must be declared after all routes.  //
//////////////////////////////////////////
app.use(logErrors)
app.use(clientErrorHandler)
app.use(apiErrorHandler)
app.use(databaseErrorHandler)
app.use(defaultErrorHandler)

////////////////////
//  Start Server  //
////////////////////
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
