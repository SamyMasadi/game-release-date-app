const express = require('express')
const router = express.Router()
const axios = require('axios')
const fs = require('fs').promises
const { URLSearchParams } = require('url')

const { wrapAsync } = require('../middleware/functions')
const { getApiResults, saveApiResults } = require('../middleware/queries')
const { checkApiQuery } = require('../middleware/validate')

/**
 * @route GET api
 * @desc Fetch search results from Giant Bomb API or database
 * @access Public
 */	
router.get('', wrapAsync(checkApiQuery), wrapAsync(async (request, response) => {
  const query = request.query.query
  let page = 1
  if (request.query.page) {
    page = request.query.page
  }
  const currentTime = Date.now()
  const maxAge = 1000 * 60 * 60 * 24 // 24 hours

  // Use cached results less than maxAge to reduce API usage.
  const savedResults = await getApiResults(query, page)
  if (savedResults && currentTime < savedResults.date.getTime() + maxAge) {
    return response.json(savedResults.results)
  }

  const json = await fs.readFile('config/keys.json', 'utf-8')
  const { api } = JSON.parse(json)
  const giantBombAPIParams = new URLSearchParams({
    api_key: api,
    field_list: 'id,image,name,deck,site_detail_url,expected_release_day,expected_release_month,expected_release_year',
    resources: 'game',
    format: 'json',
    page: page,
    query: query
  })
  const giantBombAPIURL = 'https://www.giantbomb.com/api/search/?' + giantBombAPIParams;

  const apiResponse = await axios.get(giantBombAPIURL)
  const { results } = apiResponse.data
  console.log('Fetched fresh results for ' + query)
  // Saving results should not affect response.
  saveApiResults(query, page, results, savedResults).catch(error => console.error(error))
  response.json(results)
}))

module.exports = router
