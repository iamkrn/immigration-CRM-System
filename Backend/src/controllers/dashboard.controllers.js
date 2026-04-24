const User = require('../models/user.model');
const Application = require('../models/application.model');
const Document = require('../models/document.model');

exports.getDashboard = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalApplications = await Application.countDocuments();
    const totalDocuments = await Document.countDocuments();

    const pendingDocs = await Document.countDocuments({ status: 'pending' });
    const approvedDocs = await Document.countDocuments({ status: 'approved' });
    const rejectedDocs = await Document.countDocuments({ status: 'rejected' });

    res.json({
      totalStudents,
      totalApplications,
      totalDocuments,
      pendingDocs,
      approvedDocs,
      rejectedDocs
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Dashboard Error' });
  }
};