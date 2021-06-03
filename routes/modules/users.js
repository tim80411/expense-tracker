const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

const User = require('../../models/User')


router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login',
  successRedirect: '/',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const error = []

  if (!name || !email || !password || !confirmPassword) {
    error.push('All fields are required')
  }

  if (password !== confirmPassword) {
    error.push('Password dose not match confirmPassword')
  }

  if (error.length) {
    return res.render('register', { name, email, password, confirmPassword, error })
  }

  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(password, salt))
    .then(hash => User.create({
      name,
      email,
      password: hash
    }))
    .then(() => res.redirect('/users/login')) // TODO：註冊完應該直接登入
    .catch(err => console.log(err))

})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', 'Logout success')
  res.redirect('/users/login')
})

module.exports = router