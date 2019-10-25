const express = require('express')
const router = express.Router()
const axios = require('axios')
const keys = require('../config/keys.json')

const gbApiUrlWithoutQuery = (
  "https://www.giantbomb.com/api/search/?api_key=" + keys.api 
  + "&field_list=id,image,name,deck,site_detail_url,expected_release_day,expected_release_month,expected_release_year"
  + "&resources=game&format=json&query="  // append query here when received from the user
)

/**
 * Middleware needed to make search requests to Giant Bomb's API,
 * and pass along the results back to the client.
 * CORS restrictions on browsers prevent the client from contacting
 * Giant Bomb's API directly. It also keeps the API key on the server side.
 * @route GET api/:query
 * @access Public
 */	
router.get('/:query', (request, response) => {
	const query = request.params.query
  const giantBombAPIURL = gbApiUrlWithoutQuery + query
  axios.get(giantBombAPIURL)
  .then(apiResponse => {
    console.log("Fetched results for " + query)
    response.send(apiResponse.data.results)
  })
  .catch(error => {
    console.log(error)
    response.status(502).json({ success: false })
  })
})

module.exports = router
