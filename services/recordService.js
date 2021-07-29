const Record = require('../models/Record')
const Category = require('../models/Category')
const { formatDate } = require('../lib/myLib')

const recordService = {
  getEditPage: async (_id, userId) => {
    const categories = await Category.find().lean()
    const record = await Record.findOne({ _id, userId }).populate('category').lean()

    const date = record.date
    const dateString = formatDate(date)

    return { categories, record, dateString }
  },

  getNewPage: async () => {
    const timeNow = formatDate(new Date())
    const categories = await Category.find().lean()

    return { categories, timeNow }
  },


}

module.exports = recordService