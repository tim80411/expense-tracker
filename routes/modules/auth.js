const express = require('express')
const router = express.Router()

const authController = require('../../controllers/authController')

router.get('/facebook/callback', authController.facebookLoginCallback)
router.get('/facebook', authController.facebookLogin)

module.exports = router