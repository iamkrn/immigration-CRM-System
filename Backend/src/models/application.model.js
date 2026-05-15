const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({


  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },


  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    
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
  enum: ["draft", "submitted", "approved", "rejected",
         "offer_received", "visa_processing",
         "visa_approved", "visa_rejected"],
},

  // Visa details
  visaStatus: {
  type: String,
  enum: ["not_started", "docs_pending", "submitted", "approved", "rejected", "withdrawn"],
  default: "not_started"
},

   remarks: {
    type: String
  },

  //offer-management
    offerLetter:{
    type:String //URL
    },

     offerStatus: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
      default: 'pending'
    },
    acceptanceDeadline: {
      type: Date
    },
    depositPaid: {
      type: Boolean,
      default: false
    },
    tuitionFeePaid: {
      type: Boolean,
      default: false
    },

    // Timeline
     appliedDate: {
    type: Date,
    default: Date.now
    },

    // Visa Preparation
      interviewDate: { type: Date },
      preDepartureNotes: { type: String },
      visaChecklist: [
        {
          item:      { type: String },
          completed: { type: Boolean, default: false }
        }
      ],


    }, 
    { 
      timestamps: true 
    });

module.exports = mongoose.model("Application", applicationSchema);