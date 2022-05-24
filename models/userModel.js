const mongoose = require('mongoose');
const validator = require('validator');
const bycrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    // classes: [{
    //     subject_code: {
    //         type: String,
    //         // required: true,
    //     },
    //     subject_name: {
    //         type: String,
    //         // required: true,
    //     },
    //     class_name: {
    //         type: String,
    //         // required: true
    //     },
    //     attendance: [
    //         {
    //             date: {
    //                 type: Date,
    //                 // required: true,
    //                 // default:Date.now()
    //             },
    //             no_of_student_present: {
    //                 type: Number,
    //                 // required: true,
    //                 // default:15
    //             }
    //         }
    //     ]
    // }],
    emailId: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'please provide a valid email address'],
    },
    phoneNo: {
        type: Number,
        required: true,
        unique: true,
        
    },
    role: {
        type: String,
        required: true,
        enum:["faculty","student","admin"]
    },
    verified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8
    }, 
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE Or SAVE!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same'
        },
    },
});


  
  userSchema.pre('save', async function (next) {
    // ONLY RUN THIS FUNCTION PASSWORD IS ACTUALLY MODIFIED
      
    console.log('Will save document...');    
      this.verified = false;
    if (!this.isModified('password')) return next();
    
    this.password = await bycrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bycrypt.compare(candidatePassword, userPassword);
}


//   facultySchema.post('save', function(doc, next) {
//     // console.log(doc);
//     next();
//   });
  
const User = mongoose.model('Users', userSchema);
module.exports = User;