const express = require('express');
const router = express.Router();
const upload= require('../middlewares/upload')
const {authMiddleware} = require('../middlewares/auth.middleware');
const {roleMiddleware} = require('../middlewares/roles.middlewares')

const {createDocument,getDocument,deleteDocument,updateDocumentStatus} = require('../controllers/document.controller')

// CREATE (Student)
router.post(
  '/',
  authMiddleware,
  roleMiddleware('student','counsellor'),
  upload.single('files',10),
  createDocument
);

// GET (sab login user)
router.get(
  '/:applicationId',
  authMiddleware,
  getDocument
);

// DELETE (admin only)
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('admin','counsellor'),
  deleteDocument
);

//update status
router.put(
  '/:id/status',
  authMiddleware,
  roleMiddleware('admin','counsellor'),
  updateDocumentStatus
)


module.exports = router


