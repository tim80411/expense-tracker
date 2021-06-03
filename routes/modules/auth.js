const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/facebook/callback', passport.authenticate('facebook', {
  failureRedirect: '/users/login',
  successRedirect: '/'
}))

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))



module.exports = router