const Chat = require('../../models/chating-models/chat.model')



exports.getChatByStudent = async(req,res) => {
    try {
        const {studentId} = req.params

        const chat = await Chat.findOne({studentId})
        .populate("studentId")
        .populate("counsellorId");


        if(!chat){
            return res.status(404).json({error:"chat not found"})
        }

        res.json(chat)


        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
}


//create chat
exports.createChat = async (req,res) => {
    try {
        const {studentId, consellorId} = req.body
          
        const existing = await Chat.findOne({studentid})

        if(existing){return res.json(existing)}

        const newChat = await Chat.create({
            studentId,
            consellorId
        })

        res.status(201).json(newChat)

        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}
