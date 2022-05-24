const express = require('express')
const router = express.Router();
const studentController = require('./../controller/studentController');
const authController = require('./../controller/authController');

router.post('/student-registration',authController.protect, authController.restrictTo('student'),studentController.studentRegistration);
router.get('/getAll').get(studentController.getAllStudents);

module.exports = router;