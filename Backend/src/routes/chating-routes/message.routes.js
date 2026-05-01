const express = require('express')
const {getMessage,sendMessage} = require('../../controllers/chating-controllers/message.controller')

const route = express.Router();

route.get('/:chatId',getMessage);
route.post('/',sendMessage)

module.exports = route