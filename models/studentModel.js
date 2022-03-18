const mongoose = require('mongoose');
const validator = require('validator');

const StudentSchema = new mongoose.Schema({
    email: {
        type: String,
        validate: [validator.isEmail, 'not a valid Email'],
        required: true,
        unique: true,
    },
    rollNo: {
        type: Number,
        unique: true,
        required: true,
    },
    course: {
        type: String,
        enum: ['BTech', 'MTech', 'BCA', 'MCA', 'MBA'],
        required: true,
    },
    branch: {
        type: String,
        required: function () { return this.course == 'BTech'; },
        enum: ['CSE', 'ECE', 'EN', 'ME', 'IT', 'CE']
    },
    section: {
        type: Number,
        required: true,
    },
});

const Student = mongoose.model('student', StudentSchema);
module.exports = Student;