const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,   //  important
    trim: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  role: {
    type: String,
    enum: ['student', 'counsellor', 'admin', 'superAdmin'],
    default: 'student'
  },

  phone: {
    type: String,
    trim: true
  },

  isActive: {
    type: Boolean,
    default: true
  },

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  }

}, { timestamps: true });



module.exports = mongoose.model('User', userSchema);