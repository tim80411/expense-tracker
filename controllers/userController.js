const passport = require('passport')
const userService = require('../services/userService')

const userController = {
  getLoginPage: (req, res) => {
    res.render('login')
  },

  getRegisterPage: (req, res) => {
    res.render('register')
  },

  logout: (req, res) => {
    req.logout()
    req.flash('success', 'Logout success')
    res.redirect('/users/login')
  },

  login: passport.authenticate('local', {
    failureRedirect: '/users/login',
    successRedirect: '/',
    failureFlash: true
  }),

  register: async (req, res) => {
    const registerInfo = req.body

    try {
      await userService.register(registerInfo)

      res.redirect('/users/login')
    } catch (err) {
      const error = err.message.split(',')

      return res.render('register', { ...registerInfo, error })
    }
  }
}

module.exports = userController