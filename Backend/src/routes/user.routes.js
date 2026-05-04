const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/roles.middlewares');
const Student = require('../models/student.model')
const User = require('../models/user.model')  


 // PROFILE (All Logged-in Users)

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    let userData =  req.user.toObject() ;

    if (req.user.role === "student") {
      const student = await Student.findOne({ user: req.user._id });

      if (student) {
        userData = {
          ...userData,
          studentData: student.toObject()
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
          ...req.user.toObject(),
          ...(student ? student.toObject() : {})
        }
      });
          }
      );

// PUT /api/user/profile  → Profile update karna
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Update an User
    await User.findByIdAndUpdate(req.user._id, { name, phone });

    // id student have then also change the student data
    if (req.user.role === 'student') {
      const {
        preferredCountry,
        qualification,
        city,
        state,
        country,
        fatherName,
        motherName,
        dob,
        WhatsApp,
        address,
        pinCode
      } = req.body;

      await Student.findOneAndUpdate(
        { user: req.user._id },
        {
          preferredCountry,
          qualification,
          city,
          state,
          country,
          fatherName,
          motherName,
          dob,
          WhatsApp,
          address,
          pinCode,
          phone
        }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET -all users (Admin ke liye)
router.get('/all-users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'student' } }).select('-password');
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// POST - new create (for Admin )
router.post('/create-user', authMiddleware,roleMiddleware('admin','superAdmin') ,async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // only superAdmin can create 'admin' ya 'superAdmin' only
    if ((role === 'admin' || role === 'superAdmin') && req.user.role !== 'superAdmin') {
      return res.status(403).json({ message: 'Only SuperAdmin can create Admin or SuperAdmin' });
    }

    const bcrypt = require('bcrypt');

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });

    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT - Active/Inactive toggle
router.put('/toggle/:id', authMiddleware, async (req, res) => {
  try {
    const { isActive } = req.body;
    await User.findByIdAndUpdate(req.params.id, { isActive });
    res.status(200).json({ success: true, message: "Updated!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

