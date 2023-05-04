const express = require('express')
const router = express.Router()

const { authenticateToken } = require('../middleware')
const { eventDiscussionController } = require('../controllers')

router.post('/new', authenticateToken, eventDiscussionController.createEventDiscussionPost)

router.delete('/delete/:id', authenticateToken, eventDiscussionController.deleteEventDiscussionPost)

router.get('/:id', eventDiscussionController.getEventDiscussion)

module.exports = router