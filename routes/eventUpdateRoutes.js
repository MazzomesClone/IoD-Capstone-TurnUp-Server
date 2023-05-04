const express = require('express')
const router = express.Router()

const { authenticateToken, uploadEventUpdateFile } = require('../middleware')
const { eventUpdateController } = require('../controllers')

router.post('/new/:id', authenticateToken, uploadEventUpdateFile, eventUpdateController.createEventUpdate)

router.delete('/delete/:id', authenticateToken, eventUpdateController.deleteEventUpdate)

router.get('/:id', eventUpdateController.getEventUpdates)

module.exports = router