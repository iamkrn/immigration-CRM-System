const Message = require('../../models/chating-models/message.model')

exports.sendMessage = async (req,res) => {
    try {
        const {senderId,chatId, text, attachments} = req.body;

        const message = await Message.create({
            chatId,
            senderId,
            text,
            attachments
        })
        res.status(201).json(message)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

exports.getMessage = async (req,res) => {
    try {
        const{chatId}  = req.params

        const messages = await Message.find({chatId})
        .sort({createdAt: 1})

        res.status(201).json(messages)
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}