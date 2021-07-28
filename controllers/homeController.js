const homeService = require('../services/homeService')

const homeController = {
  getIndex: async (req, res, next) => {
    const { category, month } = req.query
    const userId = req.user._id

    try {
      const data = await homeService.getIndex(category, month, userId)

      return res.render('index', data)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = homeController