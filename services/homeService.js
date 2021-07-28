const Record = require('../models/Record')
const Category = require('../models/Category')
const { formatDate } = require('../lib/myLib')

const homeService = {
  getIndex: async (category, month, userId) => {
    let lists = []

    const categories = await Category.find().lean()
    const records = await Record.find({ userId }).populate('category').lean()

    const months = records
      .map(record => {
        const date = record.date
        record.date = formatDate(date).slice(0, 7)

        return record.date
      })
      .filter((month, i, arr) => arr.indexOf(month) === i)

    // 雙重搜索
    lists = records
      .filter(record => {
        if (!category) return true
        return record.category.name === category
      })
      .filter(record => {
        if (!month) return true
        return record.date.slice(0, 7) === month
      })

    return { lists, categories, months, category, month }
  }
}

module.exports = homeService