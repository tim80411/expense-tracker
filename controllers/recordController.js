const Record = require('../models/Record')
const Category = require('../models/Category')
const { formatDate } = require('../lib/myLib')
const recordService = require('../services/recordService')

const recordController = {
  getEditPage: async (req, res, next) => {
    const _id = req.params.id
    const userId = req.user._id

    try {
      const data = await recordService.getEditPage(_id, userId)

      return res.render('edit', data)
    } catch (error) {
      next(error)
    }
  },

  getNewPage: async (req, res, next) => {
    try {
      const data = await recordService.getNewPage()

      return res.render('new', data)
    } catch (error) {
      next(error)
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