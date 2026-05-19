const Application = require('../models/application.model');
const Student  =  require('../models/student.model')
const { sendStatusUpdateEmail } = require('../services/email.service');
const { sendNotification } = require('../services/notification.service'); 


//  CREATE Application
exports.createApplication = async (req, res) => {
  try {
    const app = new Application({
      ...req.body,
      createdBy: req.user._id 
    });

    await app.save();

    res.json({
      success: true,
      data: app
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//  GET ALL (role-based)
exports.getApplications = async (req, res) => {
  try {
    let query = {};

    // counsellor only
    if (req.user.role === "counsellor") {
      query.createdBy = req.user._id;
    }
  //student only
    if (req.user.role === "student") {
      const studentDoc = await Student.findOne({user :req.user.id});
      if(studentDoc) query.student = studentDoc._id
    }


    const apps = await Application
      .find(query)
      .populate('student')
      .populate('createdBy', 'name email'); // optional

    res.json({
      success: true,
      data: apps
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//  GET ONE
exports.getApplicationById = async (req, res) => {
  try {
    const app = await Application
      .findById(req.params.id)
      .populate('student')
      .populate('createdBy', 'name email');

    if (!app) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    // counsellor → only own access
      if (req.user.role === "counsellor") {
  const createdById = app.createdBy?._id?.toString() || app.createdBy?.toString();
  if (createdById !== req.user.id) {
    return res.status(403).json({ success: false, message: "Not allowed" });
  }
}//student only own access
         if (req.user.role === "student") {
          // after populate it have only one object
          const studentId = app.student?._id 
            ? app.student._id.toString() 
            : app.student?.toString();
            
          const studentDoc = await Student.findOne({ user: req.user._id });
          if (!studentDoc || studentId !== studentDoc._id.toString()) {
            return res.status(403).json({
              success: false,
              message: "Not allowed"
            });
          }
        }

    res.json({
      success: true,
      data: app
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//  UPDATE
exports.updateApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const statusChanged = req.body.status && req.body.status !== app.status;
    const visaStatusChanged = req.body.visaStatus && req.body.visaStatus !== app.visaStatus;
    const offerAdded = req.body.offerLetter && !app.offerLetter; // New offer letter uploaded

    // ← ADD 'user' in populate so we get student's User._id
    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('student', 'email firstName user'); 

    // Email (same as before)
    if ((statusChanged || visaStatusChanged) && updated?.student?.email) {
      try {
        await sendStatusUpdateEmail({
          toEmail: updated.student.email,
          studentName: updated.student.firstName || 'Student',
          university: updated.university,
          course: updated.course,
          country: updated.country,
          newStatus: updated.status || updated.visaStatus,
          isVisa: visaStatusChanged
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError.message);
      }
    }

    // ── FCM Notifications ──
    const recipientId = updated?.student?.user;

    if (recipientId) {

      // Application status changed
      if (statusChanged) {
        await sendNotification({
          recipientId,
          senderId: req.user._id,
          type: 'application_update',
          title: 'Application Status Updated 📋',
          body: `Your application for ${updated.university} is now: ${updated.status}`,
          data: { applicationId: updated._id.toString() },
        });
      }

      // Visa status changed
      if (visaStatusChanged) {
        await sendNotification({
          recipientId,
          senderId: req.user._id,
          type: 'visa_update',
          title: 'Visa Status Updated 🛂',
          body: `Your visa status for ${updated.university} is now: ${updated.visaStatus}`,
          data: { applicationId: updated._id.toString() },
        });
      }

      // New offer letter uploaded
      if (offerAdded) {
        await sendNotification({
          recipientId,
          senderId: req.user._id,
          type: 'offer_received',
          title: 'Offer Letter Received 🎓',
          body: `You have received an offer from ${updated.university}. Please review it.`,
          data: { applicationId: updated._id.toString() },
        });
      }
    }
    // ──────────────────────────────────────────

    res.json({ success: true, data: updated });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//  DELETE 
exports.deleteApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);

    if (!app) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      }); 
    }

    // counsellor → only own delete
    if (
      req.user.role === "counsellor" &&
      app.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to delete this application"
      });
    }

    await app.deleteOne();

    res.json({
      success: true,
      message: "Application deleted"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};