const mongoose  = require('mongoose');

const documentSchema = new mongoose.Schema({
   application:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Application',
    required:true
   },

   type:{
    type:String,
    enum:[
        "sop",
        "lor",
        "passport",
        "financial",
        "academics",
        "other"

    ],
    required:true
   },

   name:String,

   fileURL:String,
    
   status:{
    type:String,
    enum:['approved','pending', 'rejected'],
    default:"pending"
   }





},{timestamps:true});


module.exports = mongoose.model('Document',documentSchema)