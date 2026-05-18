const express = require('express');
const router = express.Router();

const { LoginUser, registerUser, adminCreateUser } = require('../controllers/auth.controller'); 
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/roles.middlewares');

// Public Routes
router.post('/login', LoginUser);
router.post('/register', registerUser);

// Protected — only admin/superAdmin can create counsellor/admin
router.post('/admin/create-user', authMiddleware, roleMiddleware('admin', 'superAdmin'), adminCreateUser);

module.exports = router;