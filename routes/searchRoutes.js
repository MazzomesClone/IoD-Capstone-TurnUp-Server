const express = require('express')
const router = express.Router()

const { searchController } = require('../controllers')

router.get('/:query', searchController.retrieveBySearchQuery)

module.exports = router