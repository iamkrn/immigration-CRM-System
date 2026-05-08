import API from './API';

const chatService = {
  
   //when counsellor start chat with student
   // body: {studentId, counsellorId}
   createChat : (studentId, counsellorId) => {
    API.post("/chat",{studentId, counsellorId})
   },

   //find chat bu student id
   //body: {studentId}
    getChatByStudentId : (studentId) => {
    API.get(`/chat/${studentId}`);
    },

    // get al message  from the chat
    //body:{chatId}
    getMessages : (chatId) => {
        API.get(`/messages/${chatId}`);
    },

    //send message thorugh the routes
    //body : {chatId, senderId, text,senderModel}
    sendMessage : (chatId, senderId, text, senderModel) => {
        API.post("/message",{chatId, senderId, text, senderModel})
    }

}

export default chatService;