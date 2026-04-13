const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
   name:String,
   email:String,
   phone:String,

   preferredCountry:String,

   leadStatus:{
    type:String,
    enum:['hot','cold', 'warm'],
    default:'cold'
   }
},{timestamps:true})

module.exports = mongoose.model('Student',studentSchema)