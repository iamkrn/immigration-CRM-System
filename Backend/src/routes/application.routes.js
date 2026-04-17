const express = require('express');

const router  = express.Router();

const {createApplication, 
       deleteApplication,
       getApplications,
       getApplicationById,
       updateApplication} = require('../controllers/application.controllers');

const {authMiddleware} = require('../middlewares/auth.middleware') 
const {roleMiddleware} = require('../middlewares/roles.middlewares')


// CREATE
router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'counsellor'),
  createApplication
);

// GET ALL
router.get('/', authMiddleware, getApplications);

// GET ONE
router.get('/:id', authMiddleware, getApplicationById);

// UPDATE
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'counsellor'),
  updateApplication
);

// DELETE (admin only)
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  deleteApplication
);
module.exports = router

