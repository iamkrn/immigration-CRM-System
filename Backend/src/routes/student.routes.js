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


router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'counsellor','superAdmin'),
  createStudent
);

router.get('/', authMiddleware, getStudents);


router.get('/:id', authMiddleware, getStudentById);


router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'counsellor','superAdmin'),
  updateStudent
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('admin','superAdmin'),
  deleteStudent
);
module.exports = router;