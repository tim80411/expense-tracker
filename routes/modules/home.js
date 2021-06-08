const express = require('express')
const Record = require('../../models/Record')
const Category = require('../../models/Category')
const { formatDate } = require('../../lib/myLib')
const router = express.Router()

router.get('/', async (req, res) => {
  const { category, month } = req.query
  const userId = req.user._id
  let lists = []

  try {
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

    res.render('index', { lists, categories, months, category, month })
  } catch (error) {

    // TODO：設計一個error頁面去接error跟redirect
    res.send('database loading failed, please wait a moment then try again')
  }
})

module.exports = router
