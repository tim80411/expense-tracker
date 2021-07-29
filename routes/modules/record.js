const express = require('express')
const router = express.Router()

const recordController = require('../../controllers/recordController')

router.get('/:id/edit', recordController.getEditPage)
router.get('/new', recordController.getNewPage)
router.post('/', recordController.postRecord)
router.put('/:id', recordController.putRecord)
router.delete('/:id', recordController.deleteRecord)

module.exports = router