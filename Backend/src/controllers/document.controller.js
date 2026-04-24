const Document = require('../models/document.model');
const Application = require('../models/application.model');

exports.createDocument = async (req, res) => {
  try {
    const { name, type, application } = req.body;

    if (!name || !type || !application || !req.file) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    const doc = new Document({
      name,
      type,
      application,
      fileURL: req.file.path
    });

    await doc.save();

    //  LINK TO APPLICATION
    await Application.findByIdAndUpdate(application, {
      $push: { documents: doc._id }
    });

    res.json({
      success: true,
      data: doc
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};