const express = require('express')
const Record = require('../../models/Record')
const Category = require('../../models/Category')
const { formatDate } = require('../../lib/myLib')

const router = express.Router()

// route: add expense function
router.get('/new', async (req, res) => {
  const timeNow = formatDate(new Date())
  
  try {
    const categories = await Category.find().lean()

    res.render('new', { categories, timeNow })

  } catch (error) {
    console.error(error)
  }
})

router.post('/', async (req, res) => {
  const { name, date, category, amount, merchant } = req.body
  const userId = req.user._id

  try {
    const record = await Record.create({ name, date, category, amount, merchant, userId })
    const categoryFound = await Category.findOne({ _id: category })

    categoryFound.record.push(record._id)

    await categoryFound.save()

    res.redirect('/')
  } catch (error) {
    console.error(error)
  }

})

// route: update expense
router.get('/:id/edit', async (req, res) => {
  const _id = req.params.id
  const userId = req.user._id

  try {
    const categories = await Category.find().lean()
    const record = await Record.findOne({ _id, userId }).populate('category').lean()

    const date = record.date
    const dateString = formatDate(date)

    return res.render('edit', { categories, record, dateString })

  } catch (error) {
    console.error(error)
  }

})

router.put('/:id', async (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  const { name, date, category, amount, merchant } = req.body

  try {
    const recordFound = await Record.findOne({ _id, userId })

    await Category.findOneAndUpdate({ _id: recordFound.category, record: recordFound._id }, { $pull: { 'record': recordFound._id } })

    await Category.findOneAndUpdate({ _id: category }, { $addToSet: { 'record': recordFound._id } })

    recordFound.name = name
    recordFound.date = date
    recordFound.category = category
    recordFound.amount = amount
    recordFound.merchant = merchant

    await recordFound.save()

    res.redirect('/')

  } catch (error) {
    console.error(error)
  }

})

// route: delete expense function
router.delete('/:id', async (req, res) => {
  const _id = req.params.id
  const userId = req.user._id

  try {
    const recordFound = Record.findOne({ _id, userId })
    await Category.findOneAndUpdate({ _id: recordFound.category }, { $pull: { 'record': recordFound._id } })

    await recordFound.remove()

    res.redirect('/')
    
  } catch (error) {
    console.error(error)
  }
})

module.exports = router