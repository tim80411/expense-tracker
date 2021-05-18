const mongoose = require('mongoose')
const Category = require('../Record').category
const db = require('../../config/mongoose.js')

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
db.once('open', () => {
  console.log('start creat category seed')
  
  return Category.create(datas)
    .then(() => {
      console.log('category create success')
      return db.close()
    }).then(() => {
      console.log('db connection close success')
    }).catch(error => {
      console.error(error)
    })
})