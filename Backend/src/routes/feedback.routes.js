const express  = require('express');
const { submitFeedback, getFeedback, getCounsellorFeedback } = require('../controllers/feedback.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/',                              authMiddleware, submitFeedback);
router.get('/application/:applicationId',    authMiddleware, getFeedback);
router.get('/counsellor/:counsellorId',      authMiddleware, getCounsellorFeedback);

module.exports = router;