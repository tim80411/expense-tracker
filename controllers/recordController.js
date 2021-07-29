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

      return res.redirect('/')
    } catch (error) {
      next(error)
    }
  },

  deleteRecord: async (req, res, next) => {
    const _id = req.params.id
    const userId = req.user._id

    try {
      await recordService.deleteRecord(_id, userId)

      return res.redirect('/')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = recordController