const express = require('express')
const router = express.Router()
const multer = require('multer')
const multerConfig = require("../config/multer")

const controller = require('../controllers/image')

// These routes needs user authentication!!
const authMiddleare = require('../middlewares/auth')
router.use(authMiddleare)

router.get('/', controller.list)
router.get('/:id', controller.show)
router.put('/update/:id', controller.update)
router.post('/new', controller.new)
router.delete('/remove/:id', controller.delete)

router.post("/upload", multer(multerConfig).single('file'), controller.upload)

module.exports = router