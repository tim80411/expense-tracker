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

  postRecord: async (record, userId) => {
    const { name, date, category, amount, merchant } = record

    const recordDb = await Record.create({ name, date, category, amount, merchant, userId })
    const categoryFound = await Category.findOne({ _id: category })

    categoryFound.record.push(recordDb._id)
    await categoryFound.save()
  },


}

module.exports = recordService