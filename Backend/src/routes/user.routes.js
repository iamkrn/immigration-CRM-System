const express  = require('express');

const {authMiddleware} = require('../middlewares/auth.middleware');
const {roleMiddleware} = require('../middlewares/roles.middlewares')

const router = express.Router();


//login user only
// 
router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    user: req.user,
    msg: "Profile data"
  });
});

// admin only
router.get(
  '/admin',
  authMiddleware,
  roleMiddleware('admin'),
  (req, res) => {
    res.json({ msg: "Admin only data" });
  }
);
module.exports = router