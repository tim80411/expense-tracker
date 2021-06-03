const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')

const User = require('../models/User')


module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
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

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['displayName', 'email']
  },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile._json.email
        const name = profile._json.name
        const userFound = await User.findOne({ email })

        if (userFound) {
          return done(null, userFound)
        } else {
          const password = Math.random().toString(36).slice(-8)

          const salt = await bcrypt.genSalt(10)
          const hash = await bcrypt.hash(password, salt)

          const userCreated = await User.create({ name, email, password: hash })
          
          return done(null, userCreated)
        }
      } catch (error) {
        return done(error, false)
      }
    }
  ))


  passport.serializeUser((user, done) => done(null, user.id))

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}