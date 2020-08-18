const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  watch_list: [{
    game_id: {
      type: Number,
      required: true
    },
    title: String,
    expected_release_day: Number,
    expected_release_month: Number,
    expected_release_year: Number,
    image_url: String,
    site_detail_url: String,
    reminder: Boolean
  }]
})

module.exports = User = mongoose.model('user', UserSchema)
