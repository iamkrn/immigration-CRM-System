const express = require('express')
const {getMessage,sendMessage} = require('../../controllers/chating-controllers/message.controller')
const {authMiddleware} = require('../../middlewares/auth.middleware')

const route = express.Router();

route.get('/:chatId',authMiddleware,getMessage);
route.post('/',authMiddleware,sendMessage)

module.exports = route