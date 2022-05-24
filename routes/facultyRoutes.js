const express = require('express')
const router = express.Router();
const facultyController = require('../controller/facultyController');
const authController = require('./../controller/authController');

router
    .route('/')
    .get(facultyController.getfaculty)
    .post(facultyController.createFaculty);
router
    .route('/:id')
    .get(facultyController.get_faculty_info);
        
router.get('/new/meet', authController.protect, authController.restrictTo('faculty'), facultyController.generate_new_meet);
// router
//     .route('/new/meet') 
//     .get(facultyController.generate_new_meet);
        
module.exports = router;
