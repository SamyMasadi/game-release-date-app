const express = require('express')
const axios = require('axios')
// const bodyParser = require('body-parser')
const path = require('path')
const app = express()
app.use(express.static(path.join(__dirname, 'build')))
const myKey = require('./myKey.json')

const apiKey = myKey.apiKey
const gbApiUrlWithoutQuery = "https://www.giantbomb.com/api/search/?api_key=" + apiKey + "&resources=game&format=json&query="

// Body Parser middleware
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended:false}))

app.listen(process.env.PORT || 8080, () => {
    console.log('Server started on port 8080')
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.get('/search/:query', (request, response) => {
	const query = request.params.query
    const giantBombAPIURL = gbApiUrlWithoutQuery + query
    axios.get(giantBombAPIURL)
		.then(apiResponse => {
			console.log("Fetched results for " + query)
			response.send(apiResponse.data)
		})
		.catch(error => {
			console.log(error)
		})
})