const express = require('express')
const {getMessage,sendMessage} = require('../../controllers/chating-controllers/message.controller')
const authmiddleware = require('../../middlewares/auth.middleware')

const route = express.Router();

route.get('/:chatId',authmiddleware,getMessage);
route.post('/',authmiddleware,sendMessage)

module.exports = route