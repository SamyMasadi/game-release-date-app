const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const axios = require('axios')
const myKey = require('./src/myKey.json')
const gbApiUrlWithoutQuery = "https://www.giantbomb.com/api/search/?api_key=" + myKey.apiKey + "&resources=game&format=json&query="

app.prepare().then(() => {
  const server = express()

  /**
   * Route acts as middleware between client and Giant Bomb's API.
   */
  server.get('/search/:query', (request, response) => {
    const giantBombAPIURL = gbApiUrlWithoutQuery + request.params.query
    axios.get(giantBombAPIURL)
		.then(apiResponse => {
			console.log('Fetched results for "' + query + '"')
            const results = apiResponse.data.results
            return app.render(request, response, '/index', results)
		})
		.catch(error => {
            console.log('There was an error with the API request:\n' + error)
            res.redirect('/')
        })    
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})