const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({

    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "senderModel",   
        required: true
    },
    senderModel: {
        type: String,
        required: true,
        enum: ["User", "Student"]  
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    text: {
        type: String,
        required: true
    },
    attachments: [{          
        url: String,
        type: String,
        name: String
    }],
    seen: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);