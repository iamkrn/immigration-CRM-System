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

// CREATE (admin + counsellor)
router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'counsellor'),
  createStudent
);

// GET ALL (sab login user)
router.get('/', authMiddleware, getStudents);

// GET ONE (sab login user)
router.get('/:id', authMiddleware, getStudentById);

// UPDATE (admin + counsellor)
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'counsellor'),
  updateStudent
);

// DELETE (admin only )
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  deleteStudent
);
module.exports = router;