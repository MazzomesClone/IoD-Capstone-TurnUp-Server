const express = require('express')
const router = express.Router()

const discussionRoutes = require('./eventDiscussionRoutes')
const updateRoutes = require('./eventUpdateRoutes')

const { authenticateToken, uploadEventFile } = require('../middleware')
const { eventController } = require('../controllers')

router.use('/discussion', discussionRoutes)
router.use('/updates', updateRoutes)

router.get('/all', eventController.getEvents)

router.post('/new', authenticateToken, uploadEventFile, eventController.createEvent)

router.put('/edit/:id', authenticateToken, uploadEventFile, eventController.editEvent)

router.delete('/delete/:id', authenticateToken, eventController.deleteEvent)

router.post('/save/:id', authenticateToken, eventController.saveEventForUser)

router.delete('/unsave/:id', authenticateToken, eventController.unsaveEventForUser)

router.get('/saved', authenticateToken, eventController.getSavedEventsForUser)

router.get('/venue/:id', eventController.getEventsHostedByVenue)

router.get('/pagedata/:id', eventController.getEventPageData)

router.get('/userhosted', authenticateToken, eventController.getAllEventsHostedByUser)

module.exports = router