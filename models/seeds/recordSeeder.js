const Record = require('../Record')
const Category = require('../Category')
const User = require('../User')

const db = require('../../config/mongoose')


const expenses = [
  {
    name: '上學',
    category: '交通出行',
    date: Date.now(),
    amount: 100,
    merchant: '公車'
  },
  {
    name: '衣服',
    category: '家居物業',
    date: '1992-04-11',
    amount: 300,
    merchant: 'UniQlo'
  },
  {
    name: '早餐',
    category: '餐飲食品',
    date: new Date(2021, 6, 21, 10),
    amount: 100,
    merchant: '單單'
  },
]

// set up expense seed and renew Category's record
db.once('open', async () => {
  let randomIndex = ~~(Math.random() * 2)
  
  async function createRecordAndCategory(expense, category) {
    try {
      const recordCreate = await Record.create(expense)

      console.log(`${recordCreate.name} expense create success`)

      category.record = expense._id

      const categorySave = await category.save()

      console.log(`${categorySave.name} category renew success`)
    } catch (error) {
      console.error(error)
    }
  }

  try {
    const categories = await Category.find()
    const users = await User.find()

    await Promise.all(Array.from(categories, category => {
      return Promise.all(Array.from(expenses, expense => {
        randomIndex = ~~(Math.random() * 2)
        const randomUser = users[randomIndex]

        if (category.name === expense.category) {
          expense.category = category._id
          expense.userId = randomUser._id

          return createRecordAndCategory(expense, category)
        }
      }))
    }))

    db.close()
    console.log('db connection close')

  } catch (err) {
    console.error(err)
  }

  // return Category.find()
  //   .then(categories => {
  //     categories.forEach(category => {
  //       expenses.forEach(expense => {
  //         if (category.name === expense.category) {
  //           expense.category = category._id

  //           const recordTemp = new Record(expense)

  //           return recordTemp.save()
  //             .then(() => {
  //               console.log(`${expense.name} expense create success`)

  //               category.record = recordTemp._id

  //               return category.save()
  //                 .then(() => {
  //                   console.log(`${category.name} category renew success`)
  //                   dbClosedCount++
  //                 })
  //                 .catch(err => {
  //                   console.error(err)
  //                   dbClosedCount++
  //                 })
  //             })
  //             .then(() => {
  //               if (dbClosedCount === expenses.length) {
  //                 return db.close()
  //                   .then(() => {
  //                     console.log('db connection close')
  //                   })
  //                   .catch(err => {
  //                     console.error(err)
  //                   })
  //               }
  //             })
  //         }
  //       })
  //     })
  //   })
})