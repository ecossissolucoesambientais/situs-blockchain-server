const express = require('express')
const router = express.Router()

const controller = require('../controllers/project')
const authMiddleare = require('../middlewares/auth')

router.get('/:projectId/acceptInvite/:userId/:token', controller.acceptInvite)

router.use(authMiddleare)

router.get('/', controller.list)
router.get('/:id', controller.show)
router.put('/update/:id', controller.update)
router.post('/new', controller.new)
router.delete('/remove/:id', controller.delete)
router.post('/:projectId/invite/:userEmail', controller.inviteUser)
router.put('/:projectId/removeUser/:userId', controller.removeUser)

module.exports = router