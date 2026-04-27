const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/roles.middlewares');

 // PROFILE (All Logged-in Users)

router.get('/profile', authMiddleware, (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: req.user
    });

  } catch (error) {
    console.log("PROFILE ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});



//  ADMIN ONLY

router.get(
  '/admin',
  authMiddleware,
  roleMiddleware('admin'),
  (req, res) => {
    try {
      res.status(200).json({
        success: true,
        message: "Admin access granted",
        data: {
          user: req.user
        }
      });
    } catch (error) {
      console.log("ADMIN ERROR:", error.message);
      res.status(500).json({
        success: false,
        message: "Server Error"
      });
    }
  }
);



//  COUNSELLOR ONLY (optional add)

router.get(
  '/counsellor',
  authMiddleware,
  roleMiddleware('counsellor', 'admin'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Counsellor access granted",
      data: {
        user: req.user
      }
    });
  }
);



//  STUDENT ONLY (optional add)

router.get(
  '/student',
  authMiddleware,
  roleMiddleware('student'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Student access granted",
      data: {
        user: req.user
      }
    });
  }
);

module.exports = router;