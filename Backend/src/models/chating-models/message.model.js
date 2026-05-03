
const mongoose =  require('mongoose')

const messageSchema = new mongoose.Schema({

    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    senderModel: { type: String, enum: ["User", "Student"] },
    chatId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat"
    },
    text:{
        type:String,
        required:true
    },

    attachment:[{
        url:String,
        type:String,
        name:String
    }],

    seen:{
        type:Boolean,
        default:false
    }
    
},{timestamps:true})

module.exports = mongoose.model("Message",messageSchema)