const express = require('express');
const authController=require('../controller/authController')
const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/verification/:token').get(authController.verification);
    

module.exports = router;