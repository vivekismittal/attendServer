const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const Faculty = require('../models/facultyModel');
const catchAsync=require('./../catchAsync')
const dotenv = require('dotenv');
const AppError = require('./../utils/appError')
const { promisify } = require('util');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXP
    });
}

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);
	const cookieOptions = {
	  expires: new Date(
		Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
	  ),
	  httpOnly: true
	};
	if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
	res.cookie('jwt', token, cookieOptions);
  
	// Remove password from output
	user.password = undefined;
  
	res.status(statusCode).json({
	  status: 'success',
	  token,
	  data: {
		user
	  }
	});
  };

exports.signup = catchAsync(async (req, res, next) => {
	const newFaculty = await Faculty.create(req.body);
	
	const token = signToken(newFaculty._id);
	// await Faculty.findByIdAndUpdate(newFaculty._id, { verified: false });
	res.status(201).json({
		status: 'success',
		body: {
			faculty: newFaculty,
			message: "Verification Link has been sent to your Email, Please verify your Id"
		}
	});

	const transporter = nodemailer.createTransport({
		service: process.env.MAIL_SERVICE,
		host:process.env.MAIL_SERVICE,
		port: 587,
		secure:false,
		auth: {
			user: process.env.MAIL_ID,
			pass: process.env.PASS
		}
	});
	const mailOptions = {
		from: process.env.MAIL_ID,
		to: '8as1910062@gmail.com',
		subject: 'Verify Your Account',
		text: `${token}`,
		html:'<h1>hii</h1>'
	};
	transporter.sendMail(mailOptions, function (err, info) {
		if (err) {
			console.log(err);
		} else {
			console.log('Verification EMAIL SENT!!');
		}
	});
});

exports.verification = catchAsync(async (req, res, next) => {
	
	const decoded = await promisify(jwt.verify)(req.params.token, process.env.JWT_SECRET);

	
	const currentFaculty = await Faculty.findById(decoded.id);
	await Faculty.findByIdAndUpdate(currentFaculty._id, { verified: true });
	return res.redirect(`${process.env.URL}/faculties/${currentFaculty._id}`)
});

exports.login = catchAsync(async (req, res, next) => {
	const { emailId, password } = req.body;
	if (!emailId || !password) return next(new AppError('Please provide Email and Password', 400));

	const faculty = await Faculty.findOne({ emailId }).select('+password');

	if (!faculty || !(await faculty.correctPassword(password, faculty.password)))
		return next(new AppError('Invalid Email or Password', 401));
	
	if(!faculty.verified)
		return next(new AppError('You have not verify your Account, Please first verify your Account'),401)
		
		createSendToken(faculty, 200, res);
	
}); 		