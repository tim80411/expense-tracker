const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Record = require('./models/Record')
const Category = require('./models/Record').category

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mondodb connect failed!')
})

db.once('open', () => {
  console.log('mongodb connect success!')
})

const app = express()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

// route: add expense function
app.get('/new', (req, res) => {
  return Category.find()
    .lean()
    .then(categorys => {
      res.render('new', { categorys })
    })
    .catch(err => {
      console.error(err)
    })
})

app.post('/', (req, res) => {
  const { name, date, category, amount} = req.body
  return Record.create({name, date, category, amount})
  .then(() => {
    res.redirect('/')
  })
  .catch((err) => {
    console.error(err)
  })
})

// route: browse all expenses
app.get('/', (req, res) => {
  return Record.find()
    .populate('category')
    .lean()
    .then(lists => {
      return res.render('index', { lists })
    })
    .catch(err => {
      console.error(err)
    })
})

app.listen(3000, () => {
  console.log('Express server is running on https://localhost:3000')
})