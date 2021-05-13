const mongoose = require('mongoose')
const Category = require('../Record').category

const datas = [
  {
    name: '交通出行',
    font: 'fas fa-shuttle-van'
  },
  {
    name: '家居物業',
    font: 'fas fa-home'
  },
  {
    name: '休閒娛樂',
    font: 'fas fa-grin-beam'
  },
  {
    name: '餐飲食品',
    font: 'fas fa-utensils'
  },
  {
    name: '其他',
    font: 'fas fa-pen'
  },

]

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mondodb connect failed!')
})

db.once('open', () => {
  console.log('mongodb connect success!')
  return Category.create(datas)
    .then(() => {
      console.log('create success')
      return db.close()
    }).then(() => {
      console.log('db connection close')
    }).catch(error => {
      console.error(error)
    })
})