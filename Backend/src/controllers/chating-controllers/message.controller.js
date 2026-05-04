const Message = require('../../models/chating-models/message.model');
const { getIO, getReceiverSocketId } = require('../../socket/socket');

exports.sendMessage = async (req, res) => {
    try {
         const senderId = req.user._id;
        const { receiverId, chatId, text, attachments,senderModel } = req.body;

        const message = await Message.create({
            chatId,
            senderId,
            text,
            attachments,
            senderModel
        });

        const io = getIO();


        io.to(chatId).emit("receiveMessage", message);

    
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessageNotification", message);
        }

        res.status(201).json(message);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};