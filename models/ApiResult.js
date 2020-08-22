const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ApiResultSchema = new Schema({
  query_page: {
    type: String,
    required: true,
    unique: true
  },
  query: String,
  page: Number,
  results: Array,
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = ApiResult = mongoose.model('apiResult', ApiResultSchema)
