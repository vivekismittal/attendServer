const express = require('express');
const morgan = require('morgan');

const facultyRouter = require('./routes/facultyRoutes');

const app = express();
app.use(express.json());
app.use(morgan('dev'));


app.use('/api/v1/faculties', facultyRouter);

module.exports = app;
