const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const helpers = require('./config/helpers')
const router = require('./routes/index')
const usePassport = require('./config/passport')

const PORT = process.env.PORT

require('./config/mongoose.js')

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: helpers
}))
app.set('view engine', 'handlebars')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassport(app)

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()

  next()
})

app.use(router)

app.listen(PORT, () => {
  console.log('Express server is running on https://localhost:3000')
})