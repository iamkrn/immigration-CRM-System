
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  counsellorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    unique: true   
  },
  ratings: {
    knowledge:     { type: Number, min: 1, max: 5, required: true },
    communication: { type: Number, min: 1, max: 5, required: true },
    support:       { type: Number, min: 1, max: 5, required: true },
  },
  overallRating: { type: Number },
  comment:       { type: String },
}, { timestamps: true });

// Auto calculate overall before save
feedbackSchema.pre('save', async function() {
  const { knowledge, communication, support } = this.ratings;
  this.overallRating = parseFloat(((knowledge + communication + support) / 3).toFixed(1));

});
module.exports = mongoose.model('Feedback', feedbackSchema);