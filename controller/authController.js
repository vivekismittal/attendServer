const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync=require('./../catchAsync')
const dotenv = require('dotenv');
const AppError = require('./../utils/appError')
const { promisify } = require('util');
const Faculty = require('./../models/facultyModel');

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
	const newUser = await User.create(req.body);
	
	const token = signToken(newUser._id);
	
	res.status(201).json({
		status: 'success',
		body: {
			user: newUser,
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
		to: newfaculty.emailId,
		subject: 'Verify Your Account',
		text: `localhost:8000/api/v1/faculties/verification/${token}`,
	};
	console.log(newUser.emailId)
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

	
	const currentUser = await User.findById(decoded.id);
	await User.findByIdAndUpdate(currentUser._id, { verified: true });
	if (currentUser.role == "faculty") {
		Faculty.create({
			emailId: currentUser.emailId
		});
	}
	return res.redirect(`${process.env.URL}/users/${currentUser._id}`)
});

exports.login = catchAsync(async (req, res, next) => {
	const { emailId, password } = req.body;
	if (!emailId || !password) return next(new AppError('Please provide Email and Password', 400));

	const user = await User.findOne({ emailId }).select('+password');

	if (!user || !(await user.correctPassword(password, user.password)))
		return next(new AppError('Invalid Email or Password', 401));
	
	if(!user.verified)
		return next(new AppError('You have not verify your Account, Please first verify your Account'),401)
		
		createSendToken(user, 200, res);
	
}); 

exports.protect = catchAsync(async (req, res, next) => {
	
	let token;
	if (
	  req.headers.authorization &&
	  req.headers.authorization.startsWith('Bearer')
	) {
	  token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
	  token = req.cookies.jwt;
	}
  
	if (!token) {
	  return next(
		new AppError('You are not logged in! Please log in to get access.', 401)
	  );
	}
  
	
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
	
	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
	  return next(
		new AppError(
		  'The user belonging to this token does no longer exist.',
		  401
		)
	  );
	}

	
	
	// if (currentUser.changedPasswordAfter(decoded.iat)) {
	//   return next(
	// 	new AppError('User recently changed password! Please log in again.', 401)
	//   );
	// }
  
	
	req.user = currentUser;
	res.locals.user = currentUser;
	next();
  });
  
  
//   exports.isLoggedIn = async (req, res, next) => {
// 	if (req.cookies.jwt) {
// 	  try {
	
// 		const decoded = await promisify(jwt.verify)(
// 		  req.cookies.jwt,
// 		  process.env.JWT_SECRET
// 		);
  
		
// 		const currentUser = await User.findById(decoded.id);
// 		if (!currentUser) {
// 		  return next();
// 		}
  
		
// 		if (currentUser.changedPasswordAfter(decoded.iat)) {
// 		  return next();
// 		}
  
		
// 		res.locals.user = currentUser;
// 		return next();
// 	  } catch (err) {
// 		return next();
// 	  }
// 	}
// 	next();
//   };
  
exports.restrictTo = (...roles) => {
	return (req, res, next) => {
	  // roles ['admin', 'lead-guide']. role='user'
	  if (!roles.includes(req.user.role)) {
		  return next(
			  new AppError('You do not have permission to perform this action', 403)
		);
	  }
  
	  next();
	};
  };