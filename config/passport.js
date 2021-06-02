const passport = require('passport')
const LocaStrategy = require('passport-local').Strategy

const User = require('../models/User')


module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocaStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) done(null, false, { message: 'This email had not registed' })
        if (password !== user.password) done(null, false, { message: 'Email or password incorrect' })

        return done(null, user)
      })
      .catch(err => done(err, false))
  }))

  passport.serializeUser((user, done) => done(null, user.id))

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}