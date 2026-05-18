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
  roleMiddleware('admin', 'counsellor','superAdmin'),
  createApplication
);

// GET ALL
router.get('/', authMiddleware, getApplications);

// GET ONE
router.get('/:id', authMiddleware, getApplicationById);

router.patch(
  '/:id/visa-checklist',
  authMiddleware,
  roleMiddleware('student'),
  async (req, res) => {
    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { visaChecklist: req.body.visaChecklist },
      { new: true }
    );
    res.json({ success: true, data: updated });
  }
);

// UPDATE
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'counsellor','superAdmin'),
  updateApplication
);

// DELETE (admin only)
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'superAdmin'),
  deleteApplication
);
module.exports = router

