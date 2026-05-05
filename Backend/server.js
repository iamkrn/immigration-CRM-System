const http = require('http');
const app = require('./src/app');
const {initSocket}  = require('./src/socket/socket')
require('dotenv').config();
const connectDB = require('./src/config/db');

const server = http.createServer(app);
//initSocket is initialised
initSocket(server);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});