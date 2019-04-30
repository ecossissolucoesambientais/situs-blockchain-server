const express = require('express')
const router = express.Router()

const controller = require('../controllers/auth')

router.post('/register', controller.register)
router.post('/login', controller.login)
/* router.post('/login/forgot_password', controller.forgotPassword)
router.post('/login/reset_password', controller.resetPassword) */
router.post('/validateToken', controller.validateToken)

module.exports = router