const express = require('express')
const app = express()
const path = require('path')

app.use(express.static('./client/build'))

// Body Parser middleware
app.use(express.json())

// Use Routes
app.use('/api', require('./routes/api'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))

app.get('/', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})

app.get('/search', (request, response) => {
  response.redirect('/')
})

// Sends same page, but allows the url to reflect a search term.
app.get('/search/*', (request, response) => {
	response.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})

app.listen(process.env.PORT || 8080, () => {
  console.log('Server started on port 8080')
})
