const Feedback = require('../models/feedback.model');
const Student  = require('../models/student.model');

// POST — submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { applicationId, counsellorId, ratings, comment } = req.body;

    // student ka studentId nikalo
    const studentDoc = await Student.findOne({ user: req.user._id });
    if (!studentDoc) return res.status(404).json({ success: false, message: 'Student not found' });

    // check — already diya hai kya
    const existing = await Feedback.findOne({ applicationId });
    if (existing) return res.status(400).json({ success: false, message: 'Feedback already submitted' });

    const feedback = await Feedback.create({
      studentId: studentDoc._id,
      counsellorId,
      applicationId,
      ratings,
      comment
    });

    res.status(201).json({ success: true, data: feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET — check if feedback already given for an application
exports.getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({ applicationId: req.params.applicationId });
    res.json({ success: true, data: feedback });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET — rating of counsellor
exports.getCounsellorFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ counsellorId: req.params.counsellorId })
      .populate('studentId', 'firstName lastName')
      .sort({ createdAt: -1 });

    const avg = feedbacks.length
      ? (feedbacks.reduce((sum, f) => sum + f.overallRating, 0) / feedbacks.length).toFixed(1)
      : 0;

    res.json({ success: true, data: feedbacks, averageRating: avg, total: feedbacks.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};