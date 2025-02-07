const express = require('express')
const router = express.Router()

const controller = require('../controllers/evidence')

// These routes needs user authentication!!
const authMiddleare = require('../middlewares/auth')
router.use(authMiddleare)


router.get('/', controller.list)
router.get('/point/:id', controller.listEvidencesFromPoint)
router.get('/images/:id', controller.images)
router.get('/:id', controller.show)
router.put('/update/:id', controller.update)
router.post('/new', controller.new)
router.delete('/remove/:id', controller.delete)
router.get('/pdf/:id', controller.generateEvidencePDF)
router.get('/nftMint/:id', controller.nftMint)

module.exports = router