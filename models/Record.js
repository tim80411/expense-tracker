const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recordSchema = new Schema({
  name: {
    type: String,
    trim: true,
    require: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref:'Category'
  }, 
  date: {
    type: Date,
    default: Date.now,
    require: true
  },
  amount: {
    type: Number,
    require: true
  }
})

module.exports = mongoose.model('Record', recordSchema)