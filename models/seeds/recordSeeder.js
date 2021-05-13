const mongoose = require('mongoose')
const Record = require('../Record')
const Category = require('../Record').category

const expenses = [
  {
    name: '上學',
    category: '交通出行',
    date: Date.now(),
    amount: 100
  },
  {
    name: '衣服',
    category: '家居物業',
    date: '1992-04-11',
    amount: 300
  },
  {
    name: '早餐',
    category: '餐飲食品',
    date: new Date(2021, 6, 21, 10),
    amount: 100
  },
]

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mondodb connect failed!')
})

db.once('open', () => {
  console.log('mongodb connect success!')
  let dbCloseCount = 0
  expenses.forEach(expense => {
    Category.findOne({ name: expense.category })
      .lean()
      .then(categoryFind => {
        expense.category = categoryFind._id
      }).then(() => {
        return Record.create(expense)
          .then(() => {
            console.log(`${expense.name} expense create success`)
            dbCloseCount++
          }).catch(err => {
            console.error(err)
            dbCloseCount++
          })
      }).then(() => {
        if (dbCloseCount === expenses.length) {
          return db.close()
            .then(() => {
              console.log('db connection close')
            })
        }
      })
  })
})