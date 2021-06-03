const passport = require('passport')
const LocaStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const User = require('../models/User')


module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocaStrategy({ usernameField: 'email' }, ( email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'This email had not registed' })
        } 

        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return done(null, false, { message: 'Email or password incorrect' })
            } 

            return done(null, user)
          })

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