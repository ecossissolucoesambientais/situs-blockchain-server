const express = require('express')
const router = express.Router()
const ExcelJS = require('exceljs')

const controller = require('../controllers/export')

// These routes needs user authentication!!
/*
const authMiddleare = require('../middlewares/auth')
router.use(authMiddleare)
*/

router.get('/xlsx/:id', controller.xlsx)
router.get('/teste_lookup/:id', controller.teste_lookup)

module.exports = router