const express = require('express')
const router = express.Router()
const axios = require('axios')
const fs = require('fs').promises

const { wrapAsync } = require('../middleware/functions')

/**
 * Middleware needed to make search requests to Giant Bomb's API,
 * and pass along the results back to the client.
 * @route GET api/:query
 * @access Public
 */	
router.get('/:query', wrapAsync(async (request, response) => {
  const query = request.params.query
  const json = await fs.readFile('config/keys.json', 'utf-8')
  const { api } = JSON.parse(json)
  const giantBombAPIURL = (
    'https://www.giantbomb.com/api/search/?api_key=' + api
    + '&field_list=id,image,name,deck,site_detail_url,expected_release_day,expected_release_month,expected_release_year'
    + '&resources=game&format=json'
    + '&query=' + query
  )

  const apiResponse = await axios.get(giantBombAPIURL)
  console.log('Fetched results for ' + query)
  response.send(apiResponse.data.results)
}))

module.exports = router
