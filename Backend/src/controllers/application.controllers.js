const Application = require("../models/application.model");
const Document = require("../models/document.model");

//  VALID STATUS FLOW
const validTransitions = {
  draft: ["documents_pending", "submitted"],
  documents_pending: ["submitted"],
  submitted: ["under_review"],
  under_review: ["offer_received", "rejected"],
  offer_received: ["accepted", "rejected"],
  accepted: ["visa_processing"],
  visa_processing: ["visa_approved", "visa_rejected"]
};

// CREATE APPLICATION
exports.createApplication = async (req, res) => {
  try {
    const { student, country, university, course, intake } = req.body;

    if (!student || !country || !university || !course || !intake) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    const app = new Application({
      ...req.body,
      status: "draft"
    });

    await app.save();

    res.status(201).json({
      success: true,
      data: app
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//  GET ALL
exports.getApplications = async (req, res) => {
  try {
    const apps = await Application.find()
      .populate("student")
      .populate("documents");

    res.json({
      success: true,
      data: apps
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ONE
exports.getApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate("student")
      .populate("documents");

    if (!app) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    res.json({
      success: true,
      data: app
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE WITH STATUS CONTROL
exports.updateApplication = async (req, res) => {
  try {
    const existingApp = await Application.findById(req.params.id);

    if (!existingApp) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    //  STATUS VALIDATION
    if (req.body.status) {
      const current = existingApp.status;
      const next = req.body.status;

      if (!validTransitions[current]?.includes(next)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status transition from ${current} → ${next}`
        });
      }

      // auto date update
      if (next === "submitted") {
        req.body.appliedDate = new Date();
      }

      if (next === "visa_approved" || next === "visa_rejected") {
        req.body.decisionDate = new Date();
      }
    }

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE
exports.deleteApplication = async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Application deleted"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// LINK DOCUMENT TO APPLICATION
exports.addDocumentToApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { documentId } = req.body;

    const app = await Application.findById(applicationId);

    if (!app) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    app.documents.push(documentId);
    await app.save();

    res.json({
      success: true,
      message: "Document linked successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};