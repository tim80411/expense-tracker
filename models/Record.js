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
    ref: 'Category'
  }]
})



module.exports = mongoose.model('Record', recordSchema)

module.exports.category = mongoose.model('Category', categoryShcema)