const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },

  country: { type: String, required: true },
  university: { type: String, required: true },
  course: { type: String, required: true },

  intake: {
    type: String,
    enum: ["Jan", "May", "Sep"],
    required: true
  },

  //  ADVANCED STATUS FLOW
  status: {
    type: String,
    enum: [
      "draft",
      "documents_pending",
      "submitted",
      "under_review",
      "offer_received",
      "accepted",
      "rejected",
      "visa_processing",
      "visa_approved",
      "visa_rejected"
    ],
    default: "draft"
  },

  //  Documents linked
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document"
  }],
  

  //  Timeline
  appliedDate: Date,
  decisionDate: Date,

  //  Notes
  remarks: String,

}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);