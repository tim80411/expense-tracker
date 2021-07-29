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

  postRecord: async (req, res, next) => {
    const record = req.body
    const userId = req.user._id

    try {
      await recordService.postRecord(record, userId)

      return res.redirect('/')
    } catch (error) {
      next(error)
    }
  },

  putRecord: async (req, res, next) => {
    const _id = req.params.id
    const userId = req.user._id
    const recordInfo = req.body

    try {
      await recordService.putRecord(_id, userId, recordInfo)

      res.redirect('/')
    } catch (error) {
      next(error)
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