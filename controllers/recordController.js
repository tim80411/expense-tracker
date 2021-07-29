const Record = require('../models/Record')
const Category = require('../models/Category')
const { formatDate } = require('../lib/myLib')

const recordController = {
  getNewPage: async (req, res) => {
    const timeNow = formatDate(new Date())

    try {
      const categories = await Category.find().lean()

      res.render('new', { categories, timeNow })

    } catch (error) {
      req.flash('error', 'database loading failed, please wait a moment then try again')

      res.redirect('/')
    }
  },

  postRecord: async (req, res) => {
    const { name, date, category, amount, merchant } = req.body
    const userId = req.user._id

    try {
      const record = await Record.create({ name, date, category, amount, merchant, userId })
      const categoryFound = await Category.findOne({ _id: category })

      categoryFound.record.push(record._id)

      await categoryFound.save()

      res.redirect('/')
    } catch (error) {
      req.flash('error', 'database loading failed, please wait a moment then try again')

      res.redirect('/')
    }
  },

  getEditPage: async (req, res) => {
    const _id = req.params.id
    const userId = req.user._id

    try {
      const categories = await Category.find().lean()
      const record = await Record.findOne({ _id, userId }).populate('category').lean()

      const date = record.date
      const dateString = formatDate(date)

      return res.render('edit', { categories, record, dateString })
    } catch (error) {
      req.flash('error', 'database loading failed, please wait a moment then try again')

      res.redirect('/')
    }
  },

  putRecord: async (req, res) => {
    const _id = req.params.id
    const userId = req.user._id
    const { name, date, category, amount, merchant } = req.body

    try {
      const recordFound = await Record.findOne({ _id, userId })

      await Category.findOneAndUpdate({ _id: recordFound.category, record: recordFound._id }, { $pull: { 'record': recordFound._id } })

      await Category.findOneAndUpdate({ _id: category }, { $addToSet: { 'record': recordFound._id } })

      recordFound.name = name
      recordFound.date = date
      recordFound.category = category
      recordFound.amount = amount
      recordFound.merchant = merchant

      await recordFound.save()

      res.redirect('/')
    } catch (error) {
      req.flash('error', 'database loading failed, please wait a moment then try again')

      res.redirect('/')
    }
  },

  deleteRecord: async (req, res) => {
    const _id = req.params.id
    const userId = req.user._id

    try {
      const recordFound = Record.findOne({ _id, userId })
      await Category.findOneAndUpdate({ _id: recordFound.category }, { $pull: { 'record': recordFound._id } })

      await recordFound.remove()

      res.redirect('/')

    } catch (error) {
      req.flash('error', 'database loading failed, please wait a moment then try again')

      res.redirect('/')
    }
  }
}

module.exports = recordController