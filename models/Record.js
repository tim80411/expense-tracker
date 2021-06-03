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
  },
  merchant: {
    type: String
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    Index: true
  }
})

module.exports = mongoose.model('Record', recordSchema)