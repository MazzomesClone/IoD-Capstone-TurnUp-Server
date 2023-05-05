const express = require('express')
const router = express.Router()

const { authenticateToken, fileUploads } = require('../middleware')
const { venueController } = require('../controllers')

router.get('/all', venueController.getVenues)

router.post('/new', authenticateToken, fileUploads.uploadVenueFile, venueController.registerVenue)

router.put('/edit/:id', authenticateToken, fileUploads.uploadVenueFile, venueController.editVenue)

router.delete('/delete/:id', authenticateToken, venueController.deleteVenue)

router.post('/save/:id', authenticateToken, venueController.saveVenueForUser)

router.delete('/unsave/:id', authenticateToken, venueController.unsaveVenueForUser)

router.get('/saved', authenticateToken, venueController.getSavedVenuesForUser)

router.get('/pagedata/:id', venueController.getVenuePageData)

router.get('/check/:id', venueController.checkDuplicateVenue)

router.get('/owned', authenticateToken, venueController.getOwnedVenuesForUser)

module.exports = router