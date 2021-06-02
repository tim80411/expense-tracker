const express = require('express')
const router = express.Router()

const User = require('../../models/User')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res) => {
  res.send('POST /users/login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  if (password === confirmPassword) {
    return User.create({
      name,
      email,
      password
    })
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  }

  return res.redirect('/users/register')
})

router.get('/logout', (req, res) => {
  res.send('logout')
})

module.exports = router