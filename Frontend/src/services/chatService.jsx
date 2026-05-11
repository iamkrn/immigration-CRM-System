import API from './API';

const chatService = {
  
   //when counsellor start chat with student
   // body: {studentId, counsellorId}
   createChat : (studentId, counsellorId) => API.post("/chat",{studentId, counsellorId}),

   //find chat bu student id
   //body: {studentId}
    getChatByStudent : (studentId) => API.get(`/chat/${studentId}`),

    // get al message  from the chat
    //body:{chatId}
    getMessages : (chatId) => API.get(`/message/${chatId}`),

    //send message thorugh the routes
    //body : {chatId, receiverId, text,senderModel}
    sendMessage : (chatId, receiverId, text, senderModel) => API.post("/message",{chatId, receiverId, text, senderModel}),

    getAllChats : () => API.get("/chat")
    

}

export default chatService;