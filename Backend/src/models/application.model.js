const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({

  // 🔗 Student reference
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },

  // Application details
  country: {
    type: String,
    required: true
  },

  university: {
    type: String,
    required: true
  },

  course: {
    type: String,
    required: true
  },

  intake: {
    type: String,
    enum: ["Jan", "May", "Sep"],
    required: true
  },

  // Status tracking
  status: {
    type: String,
    enum: ["draft", "submitted", "approved", "rejected"],
    default: "draft"
  },

  // Extra notes (Counsellor/Admin use)
  remarks: {
    type: String
  },

  // Timeline
  appliedDate: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);