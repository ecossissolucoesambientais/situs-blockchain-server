const express = require('express')
const router = express.Router()

const controller = require('../controllers/export')

// These routes needs user authentication!!
/* const authMiddleare = require('../middlewares/auth')
router.use(authMiddleare) */

router.get('/xlsx/:id', controller.xlsx)

module.exports = router