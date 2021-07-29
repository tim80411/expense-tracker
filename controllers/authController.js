const passport = require('passport')

const authController = {
  facebookLogin: passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
  }),

  facebookLoginCallback: passport.authenticate('facebook', {
    failureRedirect: '/users/login',
    successRedirect: '/'
  })
}

module.exports = authController