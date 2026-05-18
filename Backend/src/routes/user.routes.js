const express = require('express');
const router = express.Router();

const { calculateProfileCompletion } = require('../controllers/student.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/roles.middlewares');
const Student = require('../models/student.model');
const User = require('../models/user.model');


// ── PROFILE GET (All Logged-in Users) ──
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    let userData = req.user.toObject();

    if (req.user.role === "student") {
      const student = await Student.findOne({ user: req.user._id });
      if (student) {
        userData = {
          ...userData,
          studentData: student.toObject()
        };
      }
    }

    res.status(200).json({ success: true, user: userData });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// ── ADMIN ONLY ──
router.get(
  '/admin',
  authMiddleware,
  roleMiddleware('admin', 'superAdmin'),
  (req, res) => {
    try {
      res.status(200).json({
        success: true,
        message: "Admin access granted",
        data: { user: req.user }
      });
    } catch (error) {
      console.log("ADMIN ERROR:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);


// ── COUNSELLOR ONLY ──
router.get(
  '/counsellor',
  authMiddleware,
  roleMiddleware('counsellor', 'admin', 'superAdmin'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Counsellor access granted",
      data: { user: req.user }
    });
  }
);


// ── STUDENT ONLY ──
router.get(
  '/student',
  authMiddleware,
  roleMiddleware('student'),
  async (req, res) => {
    try {
      
      const student = await Student.findOne({ user: req.user._id });
      res.json({
        success: true,
        user: {
          ...req.user.toObject(),
          ...(student ? student.toObject() : {})
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
);


// ── PROFILE UPDATE ──
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body;

    await User.findByIdAndUpdate(req.user._id, { name, phone });

    if (req.user.role === 'student') {
      const {
        preferredCountry, qualification, city, state, country,
        fatherName, motherName, dob, WhatsApp, address, pinCode,
        education, passingYear, schoolName, ieltsScore, toeflScore, pteScore,
        visaType, intakeYear, courseMajor, leadReference, nationality
      } = req.body;

      
      const updatedStudent = await Student.findOneAndUpdate(
        { user: req.user._id },
        {
          preferredCountry, qualification, city, state, country,
          fatherName, motherName, dob, WhatsApp, address, pinCode,
          phone, education, passingYear, schoolName, ieltsScore, toeflScore, pteScore,
          visaType, intakeYear, courseMajor, leadReference, nationality
        },
        { new: true } 
      );

      if (updatedStudent) {
        const newScore = calculateProfileCompletion(updatedStudent);
        await Student.findOneAndUpdate(
          { user: req.user._id },
          { profileCompletion: newScore }
        );
      }
    }

    res.status(200).json({ success: true, message: 'Profile updated successfully' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// ── ALL USERS (Admin only) ──
router.get(
  '/all-users',
  authMiddleware,
  roleMiddleware('admin', 'superAdmin'),
  async (req, res) => {
    try {
      const users = await User.find({ role: { $ne: 'student' } }).select('-password');
      res.status(200).json({ success: true, users });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }
);




// ── TOGGLE ACTIVE/INACTIVE ──
router.put(
  '/toggle/:id',
  authMiddleware,
  roleMiddleware('admin', 'superAdmin'),
  async (req, res) => {
    try {
      const { isActive } = req.body;
      await User.findByIdAndUpdate(req.params.id, { isActive });
      res.status(200).json({ success: true, message: "Updated!" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }
);


// ── FCM TOKEN SAVE ──
router.patch('/fcm-token', authMiddleware, async (req, res) => {
  try {
    const { fcmToken } = req.body;

    if (!fcmToken) {
      return res.status(400).json({ message: "FCM token is required" });
    }

    await User.findByIdAndUpdate(req.user._id, { fcmToken });
    res.status(200).json({ success: true, message: "FCM token saved" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;