const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Record = require('./models/Record')

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

// route: browse all expenses
app.get('/', (req, res) => {
  return Record.find()
    .populate('category')
    .lean()
    .then(lists => {
      console.log(lists)
      return res.render('index', { lists })
    })
})

app.listen(3000, () => {
  console.log('Express server is running on https://localhost:3000')
})