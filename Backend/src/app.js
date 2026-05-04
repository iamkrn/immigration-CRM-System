const express  = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const studentRoutes = require('./routes/student.routes')
const applicationRoutes = require('./routes/application.routes')
const documentRoutes = require('./routes/document.routes')
const dashboardRoutes = require('./routes/dashboard.routes');
const chatRoutes = require('./routes/chating-routes/chat.routes')
const messageRoutes = require('./routes/chating-routes/message.routes')


app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)
app.use('/api/students',studentRoutes)
app.use('/api/applications',applicationRoutes)
app.use('/api/documents',documentRoutes)
app.use('/uploads',express.static('uploads'))
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chat',chatRoutes),
app.use('/api/message',messageRoutes)

module.exports = app;