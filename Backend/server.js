require('dotenv').config();

const http = require('http');
const app = require('./src/app');
const {initSocket}  = require('./src/socket/socket')
const connectDB = require('./src/config/db');

// verify email config on startup
const { verifyEmailService } = require('./src/services/email.service');

const server = http.createServer(app);
//initSocket is initialised
initSocket(server);

const PORT = process.env.PORT || 5000;

connectDB();
verifyEmailService();


server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});