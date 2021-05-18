const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const helpers = require('./config/helpers')
const router = require('./routes/index')
const PORT = process.env.PORT || 3000

require('./config/mongoose.js')

const app = express()

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: helpers
}))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(router)

app.listen(PORT, () => {
  console.log('Express server is running on https://localhost:3000')
})