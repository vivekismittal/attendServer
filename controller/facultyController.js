var crypto = require('crypto');

const User = require('../models/userModel');
const Faculty = require('./../models/facultyModel');
const catchAsync = require('./../catchAsync');

exports.createFaculty = catchAsync(async (req, res, next) => {
    const newFaculty = await Faculty.create(req.body);
    res.status(201).json({
        status: 'success',
        body: {
            newFaculty
        },
    });
});

exports.getfaculty = catchAsync(async (req, res, next) => {
    const fac = await User.find();
    res.status(200).json({
        status: 'success',
        body: {
            fac
        },
    });
});

exports.get_faculty_info = catchAsync(async (req, res, next) => {
    const fac = await User.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        body: {
            fac
        },
    });
});

exports.generate_new_meet = catchAsync(async (req, re, next) => {
    const len = 6;
    const code = crypto.randomBytes(Math.ceil(len / 2))
        .toString('hex')
        .slice(0, len).toUpperCase();

    const newFaculty=await Faculty.create({
        emailId: req.user.emailId,
        classMeet: {
            code:code
        }
    });
    
    re.status(200).json({
        status: 'success',
        body: {
            newFaculty
        }
    });
});