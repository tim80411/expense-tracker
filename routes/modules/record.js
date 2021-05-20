const express = require('express')
const Record = require('../../models/Record')
const Category = require('../../models/Category')

const router = express.Router()

// route: add expense function
router.get('/new', (req, res) => {
  return Category.find()
    .lean()
    .then(categories => {
      res.render('new', { categories })
    })
    .catch(err => {
      console.error(err)
    })
})

router.post('/', (req, res) => {
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

// route: update expense
router.get('/:id/edit', (req, res) => {
  const id = req.params.id

  return Category.find()
    .lean()
    .then(categories => {
      return Record.findById(id)
        .populate('category')
        .lean()
        .then(record => {
          const date = record.date
          let dateString = ''

          dateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`

          res.render('edit', { categories, record, dateString })
        })
    })
    .catch(err => {
      console.error(err)
    })
})

router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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

module.exports = router