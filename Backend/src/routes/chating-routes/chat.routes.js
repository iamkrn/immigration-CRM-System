const express = require('express')
const {getChatByStudent,createChat} = require('../../controllers/chating-controllers/chat.controller')
const authmiddleware = require('../../middlewares/auth.middleware')
const route = express.Router();

route.post('/',authmiddleware,createChat)
route.get('/:studentId',authmiddleware,getChatByStudent)

module.exports = route