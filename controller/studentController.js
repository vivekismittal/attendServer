const catchAsync = require('../catchAsync');
const Student = require('./../models/studentModel');

exports.studentRegistration = catchAsync(async (req, res, next) => {
    let newStudent = req.body;
    newStudent = {  emailId: req.user.emailId,...newStudent };

    const new_student = await Student.create(newStudent);
    res.status(201).json({
        status: "success",
        body: {
            new_student
        }
    });
});

exports.getAllStudents = catchAsync(async (req, res, next) => {
    const std = await Student.find();
    res.status(200).json({
        status: "succcess",
        results: std.length,
        body: {
            std,
        },
    });
});