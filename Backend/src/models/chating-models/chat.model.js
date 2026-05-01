
const mongoose =  require('mongoose')

const chatSchema = new mongoose.Schema({
    
    cousellorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true

    },

    studentId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
        required:true
    },

    isActive:{
        type:Boolean,
        default:true
    }

},{timestamps:true})

module.exports = mongoose.model("Chat",chatSchema.index({studentId: 1}, {unique: true}))