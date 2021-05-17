const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const helpers = require('./config/helpers')
const Record = require('./models/Record')
const Category = require('./models/Record').category

mongoose.connect('mongodb://localhost/expense-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

const db = mongoose.connection

db.on('error', () => {
  console.log('mondodb connect failed!')
})

db.once('open', () => {
  console.log('mongodb connect success!')
})

const app = express()

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: helpers
}))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

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
  const { name, date, category, amount } = req.body

  const record = new Record({ name, date, category, amount })

  return record.save()
    .then(() => {
      return Category.findOne({ _id: category })
        .then(categoryFound => {
          categoryFound.record.push(record._id)
          return categoryFound.save()
            .then(() => {
              res.redirect('/')
            })
        })
    })
})

// route: browse all expenses
app.get('/', (req, res) => {
  return Record.find()
    .populate('category')
    .lean()
    .then(lists => {
      return Category.find()
        .lean()
        .then(categorys => {
          res.render('index', { lists, categorys })
        })
    })
    .catch(err => {
      console.error(err)
    })
})

// route: update expense
app.get('/:id/edit', (req, res) => {
  const id = req.params.id

  return Category.find()
    .lean()
    .then(categorys => {
      return Record.findById(id)
        .populate('category')
        .lean()
        .then(record => {
          const date = record.date
          let dateString = ''

          dateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`

          res.render('edit', { categorys, record, dateString })
        })
    })
    .catch(err => {
      console.error(err)
    })
})

app.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, date, category, amount } = req.body

  return Record.findById(id)
    .then(recordFound => {
      // 原類別 remove old record
      return Category.findOneAndUpdate({ _id: recordFound.category, record: recordFound._id }, { $pull: { 'record': recordFound._id } })
        .then(() => {
          // 新類別 add new record
          return Category.findOneAndUpdate({ _id: category }, { $addToSet: { 'record': recordFound._id } })
            .then(() => {
              recordFound.name = name
              recordFound.date = date
              recordFound.category = category
              recordFound.amount = amount

              return recordFound.save()
                .then(() => {
                  res.redirect('/')
                })
                .catch(err => {
                  console.error(err)
                })
            })
        })
        .catch(err => {
          console.error(err)
        })
    })
    .catch(err => {
      console.error(err)
    })

})

// route: delete expense function
app.delete('/:id', (req, res) => {
  const id = req.params.id

  return Record.findById(id)
    .then(recordFound => {
      return Category.findOneAndUpdate({ _id: recordFound.category }, { $pull: { 'record': recordFound._id } })
        .then(() => {
          return recordFound.remove()
            .then(() => {
              res.redirect('/')
            })
        })
    })
})

// route: sort function

app.get('/sort', (req, res) => {
  const categoryName = req.query.category

  return Category.find()
    .populate({
      path: 'record',
      populate: [{
        path: 'category'
      }]
    })
    .lean()
    .then(categorys => {
      const categoryFiltered = categorys.filter(category => category.name === categoryName)

      const lists = categoryFiltered[0].record

      res.render('index', { lists, categoryName, categorys })

    })
    .catch(err => {
      console.error(err)
    })
})

app.listen(3000, () => {
  console.log('Express server is running on https://localhost:3000')
})