const express = require('express')
const router = express.Router()

const { authenticateToken, uploadUserPFPFile } = require('../middleware')
const { userController } = require('../controllers')

router.post('/login', userController.loginUser)

router.put('/edit', authenticateToken, uploadUserPFPFile, userController.editUser)

router.post('/new', userController.registerUser)

router.get('/verify', authenticateToken, userController.verifyUser)

router.delete('/logout', userController.logoutUser)

router.get('/:id', userController.getUser)

module.exports = router