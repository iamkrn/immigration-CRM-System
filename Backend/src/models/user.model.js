const mongoose  = require('mongoose');

const userSchema = new mongoose.Schema({
     name:{
        type:String,
        required: true,
        
     },
     email:{
        type:String,
        required:true,
        unique:true,
     },

     password:{
        type:String,
        required:true,

     },
     user_role:{
         type:String,
         enum:['Student', 'Counsellor', 'Admin'],
         default:'Student',

     },
     phone:{
      type: String,
     },

     isActive: {
      type:Boolean,
      default: true
     }



     //fields for only student

     

}, {timestamps:true})

module.exports = mongoose.model('User', userSchema);