const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  //  Basic Info
  firstName: { type: String, required: true },
  lastName: String,
  email: { type: String, required: true },
  phone: String,
  whatsapp: String,
  dob: Date,
  nationality: String,
  currentLocation: String,

  //  Family
  fatherName: String,
  motherName: String,

  //  Address
  address: String,
  city: String,
  state: String,
  pincode: String,
  country: String,

  //  Academic Info
  qualification: String,
  universityCollege: String,
  passingYear: String,
  ieltsScore: String,
  toeflScore: String,
  pteScore: String,

  //  Preferences
  preferredCountry: String,
  preferredUniversities: [String],
  courseInterest: String,
  intakeYear: String,

  //  CRM Core
  leadStatus: {
    type: String,
    enum: ["new", "hot", "warm", "cold"],
    default: "new"
  },

  source: {
    type: String,
    enum: ["website", "counsellor", "school", "partner"],
    default: "website"
  },

  sku: {
    type: String,
    enum: ["super_premium", "premium", "value_plus", "alliance"]
  },

  assignedCounsellor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  //  Profile Completion (AUTO CALCULATED)
  profileCompletion: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);