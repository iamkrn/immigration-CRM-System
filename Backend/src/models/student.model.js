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
    enum:['hot','cold', 'warm','new'],
    default:'new'
   },

   sku:{
    type:String,
    enum:['superPremium','value+','premium','alliance'],
    default:'alliance'
   },

   profileCompletion:{
    type:Number,
    default:0
   },

   isActive: {
  type: Boolean,
  default: true
},

//for counsellor
assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},

//student login user
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},

//(safe addition for chat system)
hasChat: {
  type:Boolean,
  default: false
},
lastMessageAt: {
  type: Date
},

   //future
   ieltsScore:String,
   passport:String,
   sop:String,
   lor:String,
},{timestamps:true})

module.exports = mongoose.model('Student',studentSchema)