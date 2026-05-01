const express = require('express')
const {getChatByStudent,createChat} = require('../../controllers/chating-controllers/chat.controller')

const route = express.Router();

route.post('/',createChat)
route.get('/:studentId',getChatByStudent)

module.exports = route