const express = require('express')

const home = require('./modules/home')
const record = require('./modules/record')

const router = express.Router()

router.use('/', home)
router.use('/record', record)

module.exports = router