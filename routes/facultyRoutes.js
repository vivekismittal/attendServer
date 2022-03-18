const express = require('express');
const facultyController = require('./../controller/facultyController');
const authController=require('./../controller/authController')
const router = express.Router();


router
    .route('/')
    .get(facultyController.getfaculty)
    
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/verification/:token').get(authController.verification);

router
    .route('/:id')
    .get(facultyController.get_faculty_info);
    

module.exports = router;