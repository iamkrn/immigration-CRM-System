const Application = require('../models/application.model');

//  CREATE Application
exports.createApplication = async (req, res) => {
  try {
    const app = new Application({
      ...req.body,
      createdBy: req.user.id // IMPORTANT
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
      query.createdBy = req.user.id;
    }
  //student only
    if (req.user.role === "student") {
  query.student = req.user._id;
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
      if (
        req.user.role === "counsellor" &&
        app.createdBy?._id 
          ? app.createdBy._id.toString() !== req.user.id
          : app.createdBy?.toString() !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Not allowed"
        });
      }  
      //student only own access
         if (req.user.role === "student") {
          // after populate it have only one object
          const studentId = app.student?._id 
            ? app.student._id.toString() 
            : app.student?.toString();
            
          if (studentId !== req.user._id.toString()) {
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
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    // counsellor → only own update
    if (
          req.user.role === "counsellor" &&
          app.createdBy?._id 
            ? app.createdBy._id.toString() !== req.user.id
            : app.createdBy?.toString() !== req.user.id
        ) {
          return res.status(403).json({
            success: false,
            message: "Not allowed"
          });
        }
    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      {returnDocument:  'after' }
    );

    res.json({
      success: true,
      data: updated
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
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
      app.createdBy.toString() !== req.user.id
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