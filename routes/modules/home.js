const express = require('express')
const Record = require('../../models/Record')
const Category = require('../../models/Category')
const router = express.Router()

// route: browse all expenses
router.get('/', (req, res) => {
  return Record.find()
    .populate('category')
    .lean()
    .then(lists => {
      return Category.find()
        .lean()
        .then(categories => {
          lists.forEach(list => {
            const date = list.date
            let dateString = ''

            dateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`

            list.date = dateString
          })
          res.render('index', { lists, categories })
        })
    })
    .catch(err => {
      console.error(err)
    })
})

// route: sort function
router.get('/sort', (req, res) => {
  const categoryName = req.query.category

  return Category.find()
    .populate({
      path: 'record',
      populate: [{
        path: 'category'
      }]
    })
    .lean()
    .then(categories => {
      const categoryFiltered = categories.filter(category => category.name === categoryName)

      const lists = categoryFiltered[0].record

      lists.forEach(list => {
        const date = list.date
        let dateString = ''

        dateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`

        list.date = dateString
      })

      res.render('index', { lists, categoryName, categories })

    })
    .catch(err => {
      console.error(err)
    })
})

module.exports = router
