const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categoryShcema = new Schema({
  name: {
    type: String,
    require: true
  },
  font: {
    type: String,
  },
  record: [{
    type: Schema.Types.ObjectId,
    ref: 'Record'
  }]
})

module.exports = mongoose.model('Category', categoryShcema)
