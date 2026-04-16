const express  = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const studentRoutes = require('./routes/student.routes')
const applicationRoutes = require('./routes/application.routes')
const documentRoutes = require('./routes/document.routes')

app.use(cors());

app.use(express.json());

app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)
app.use('/api/students',studentRoutes)
app.use('/api/applications',applicationRoutes)
app.use('/api/documents',documentRoutes)
app.use('/uploads',express.static('uploads'))

module.exports = app;