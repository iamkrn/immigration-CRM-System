const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
   //Basic
    firstName: String,
    lastName: String,
    email:String,
    phone:String,
    WhatsApp: String,
    dob:String,
    age:Number,

    //family
    fatherName:String,
    motherName: String,

    //location
    address:String,
    city:String,
    state:String,
    pinCode:Number,
    country:String,

    //Education
    education:String,
    qualification:String,
    passingYear:String,

    //Immigration
    preferredCountry:String,
    visaType:String,
    intakeYear: String,

    //CRM
    leadStatus:{
    type:String,
    enum:['hot','cold', 'warm'],
    default:'new'
   },

   isActive: {
  type: Boolean,
  default: true
},
assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},

user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},

   //future
   ieltsScore:String,
   passport:String,
   sop:String,
   lor:String,
},{timestamps:true})

module.exports = mongoose.model('Student',studentSchema)