const express = require('express');
const router = express.Router();

const {
  createStudent,
  getStudentById,
  getStudents,
  updateStudent,
  deleteStudent
} = require('../controllers/student.controller');

const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/roles.middlewares');

// Create
router.post(
  '/',
  authMiddleware,
  roleMiddleware('Admin', 'Counsellor', 'Student'),
  createStudent
);

// Get all
router.get(
  '/',
  authMiddleware,
  getStudents
);

// Get single
router.get(
  '/:id',
  authMiddleware,
  getStudentById
);

// Update
router.put(
  '/:id',
  authMiddleware,
  updateStudent
);

// Delete
router.delete(
  '/:id',
  authMiddleware,
  deleteStudent
);

module.exports = router;