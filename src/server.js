const express = require('express')
const app = express()
const axios = require('axios')
// const bodyParser = require('body-parser')
//const path = require('path')

app.use(express.static('../build'))
const myKey = require('./myKey.json')

const gbApiUrlWithoutQuery = (
  "https://www.giantbomb.com/api/search/?api_key=" + myKey.apiKey 
  + "&field_list=image,name,deck,site_detail_url,expected_release_day,expected_release_month,expected_release_year"
  + "&resources=game&format=json&query="  // append query here when received from the user
)

// Body Parser middleware
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended:false}))

app.listen(process.env.PORT || 8080, () => {
  console.log('Server started on port 8080')
})

app.get('/', (request, response) => {
  response.sendFile('index.html', { root: '../build' })
})

app.get('/search', (request, response) => {
  response.redirect('/')
})

// Sends same page, but allows the url to reflect a search term.
app.get('/search/*', (request, response) => {
	console.log("sending page with search term")
	response.sendFile('index.html', { root: '../build' })
})

/*
	Middleware needed to make search requests to Giant Bomb's API,
	and pass along the results back to the client.
	CORS restrictions on browsers prevent the client from contacting
	Giant Bomb's API directly. It also keeps the API key on the server side.
*/
app.get('/api/:query', (request, response) => {
	const query = request.params.query
  const giantBombAPIURL = gbApiUrlWithoutQuery + query
  axios.get(giantBombAPIURL)
  .then(apiResponse => {
    console.log("Fetched results for " + query)
    response.send(apiResponse.data.results)
  })
  .catch(error => {
    console.log(error)
    response.end()
  })
})