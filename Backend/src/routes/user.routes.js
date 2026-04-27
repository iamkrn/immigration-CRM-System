const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/roles.middlewares');
const Student = require('../models/student.model')

 // PROFILE (All Logged-in Users)

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    let userData = { ...req.user._doc };

    if (req.user.role === "student") {
      const student = await Student.findOne({ user: req.user._id });

      if (student) {
        userData = {
          ...userData,
          studentData: student
        };
      }
    }

    res.status(200).json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
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
  async(req, res) => {

   // instead of direct req.user
  const student = await require('../models/student.model')
  .findOne({ email: req.user.email });

   res.json({
  success: true,
  user: {
    ...req.user._doc,
    ...(student ? student._doc : {})
  }
});
    }
);

module.exports = router;