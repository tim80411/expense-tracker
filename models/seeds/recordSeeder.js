const Record = require('../Record')
const Category = require('../Category')

const db = require('../../config/mongoose')

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

// set up expense seed and renew Category's record
db.once('open', () => {
  let dbClosedCount = 0

  return Category.find()
    .then(categories => {
      categories.forEach(category => {
        expenses.forEach(expense => {
          if (category.name === expense.category) {
            expense.category = category._id

            const recordTemp = new Record(expense)

            return recordTemp.save()
              .then(() => {
                console.log(`${expense.name} expense create success`)

                category.record = recordTemp._id

                return category.save()
                  .then(() => {
                    console.log(`${category.name} category renew success`)
                    dbClosedCount++
                  })
                  .catch(err => {
                    console.error(err)
                    dbClosedCount++
                  })
              })
              .then(() => {
                if (dbClosedCount === expenses.length) {
                  return db.close()
                    .then(() => {
                      console.log('db connection close')
                    })
                    .catch(err => {
                      console.error(err)
                    })
                }
              })
          }
        })
      })
    })
})