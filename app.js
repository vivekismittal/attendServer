const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const facultyRouter = require('./routes/facultyRoutes');
const studentRouter = require('./routes/studentRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());


app.use('/api/v1/faculty', facultyRouter);
app.use('/api/v1/student', studentRouter);
app.use('/api/v1/users', userRouter); 

module.exports = app;
