const express = require('express')
const router = express.Router()

const { authenticateToken, fileUploads } = require('../middleware')
const { eventUpdateController } = require('../controllers')

router.post('/new/:id', authenticateToken, fileUploads.uploadEventUpdateFile, eventUpdateController.createEventUpdate)

router.delete('/delete/:id', authenticateToken, eventUpdateController.deleteEventUpdate)

router.get('/:id', eventUpdateController.getEventUpdates)

module.exports = router