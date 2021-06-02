const express = require('express')

const home = require('./modules/home')
const record = require('./modules/record')
const users = require('./modules/users')

const router = express.Router()

router.use('/users', users)
router.use('/record', record)
router.use('/', home)


module.exports = router