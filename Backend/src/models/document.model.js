const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true
  },

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  },

  type: {
    type: String,
    enum: [
      "passport",
      "sop",
      "lor",
      "financial",
      "academics",
      "resume",
      "other"
    ],
    required: true
  },

  name: String,

  fileURL: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending"
  },

  remarks: String

}, { timestamps: true });

module.exports = mongoose.model("Document", documentSchema);