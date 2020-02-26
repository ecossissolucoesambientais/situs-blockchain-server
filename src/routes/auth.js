const express = require('express')
const router = express.Router()

const controller = require('../controllers/auth')

router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/forgot_password', controller.forgotPassword)
router.post('/reset_password', controller.resetPassword)
router.post('/validateToken', controller.validateToken)

module.exports = router