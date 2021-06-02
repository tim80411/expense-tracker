const express = require('express')

const router = express.Router()

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
  res.send('POST /users/register')
})

router.get('/logout', (req, res) => {
  res.send('logout')
})

module.exports = router