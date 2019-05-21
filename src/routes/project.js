const express = require('express')
const router = express.Router()

const controller = require('../controllers/project')

// These routes needs user authentication!!
const authMiddleare = require('../middlewares/auth')
router.use(authMiddleare)

router.get('/', controller.list)
router.get('/:id', controller.show)
router.put('/update/:id', controller.update)
router.post('/new', controller.new)
router.delete('/remove/:id', controller.delete)

module.exports = router