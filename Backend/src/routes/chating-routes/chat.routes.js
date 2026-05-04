const express = require('express')
const {getChatByStudent,createChat} = require('../../controllers/chating-controllers/chat.controller')
const {authMiddleware} = require('../../middlewares/auth.middleware')
const route = express.Router();

route.post('/',authMiddleware,createChat)
route.get('/:studentId',authMiddleware,getChatByStudent)

module.exports = route