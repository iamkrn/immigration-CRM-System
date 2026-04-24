const User = require('../models/user.model');
const Application = require('../models/application.model');
const Document = require('../models/document.model');

exports.getDashboard = async (req, res) => {
  try {
    //  Basic counts
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalApplications = await Application.countDocuments();
    const totalDocuments = await Document.countDocuments();

    //  Document stats
    const pendingDocs = await Document.countDocuments({ status: 'pending' });
    const verifiedDocs = await Document.countDocuments({ status: 'verified' });
    const rejectedDocs = await Document.countDocuments({ status: 'rejected' });

    //  Application status breakdown (IMPORTANT)
    const applicationStats = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // convert to object
    const statusCounts = {};
    applicationStats.forEach(item => {
      statusCounts[item._id] = item.count;
    });

    res.json({
      totalStudents,
      totalApplications,
      totalDocuments,
      pendingDocs,
      verifiedDocs,
      rejectedDocs,
      applicationStatus: statusCounts
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Dashboard Error' });
  }
};