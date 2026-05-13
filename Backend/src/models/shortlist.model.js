const mongoose =  require('mongoose');

const universitySchema =  new mongoose.Schema({
    name: {type:String, required:true},
    country: {type:String, required:true},
    reason: {type:String, required:true},
    course: {type:String, required:true},

    status :{
        type:String,
        enum : ['shortlisted', 'applied', 'rejected', 'offer-received', 'withdrawn'],
        default: 'shortlisted'
    },
    addedBy :{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    addedAt : {type:Date, default:Date.now}
});


const shortlistSchema =  new mongoose.Schema({

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required:true,
        unique :true  //one shortlist per student
    }, 

    createdBy: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
     
    universities: [universitySchema],
},{timestamps:true});

module.exports = mongoose.model('Shortlist', shortlistSchema)