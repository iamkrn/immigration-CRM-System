const express = require('express');
const router = express.Router();
const upload= require('../middlewares/upload')
const {createDocument,getDocument,deleteDocument} = require('../controllers/document.controller')

router.post('/', upload.single('file'), createDocument);
router.get('/:applicationId',getDocument)
router.delete('/:id',deleteDocument)

module.exports = router

