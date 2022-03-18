const Faculty = require('./../models/facultyModel');

const catchAsync = require('./../catchAsync');
// exports.createFaculty = catchAsync(async (req, res, next) => {
//     const newFaculty = await Faculty.create(req.body);
//     res.status(201).json({
//         status: 'success',
//         body: {
//             newFaculty
//         },
//     });
// });

exports.getfaculty = catchAsync(async (req, res, next) => {
    const fac = await Faculty.find();
    res.status(200).json({
        status: 'success',
        body: {
            fac
        },
    });
});

exports.get_faculty_info = catchAsync(async (req, res, next) => {
    const fac = await Faculty.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        body: {
            fac
        },
    });
});
