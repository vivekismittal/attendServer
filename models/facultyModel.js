const  mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
    emailId: {
        type: String,
        required: true,
    },
    classMeet: {
        code: {
            type: String,
            unique:true,
            // required: function ()   {return this.classMeet.isEmpty();}
        },
        student: [{
            email: {
                type:String,
                required: true
            },
        }]
    }
});

const Faculty = mongoose.model("Faculty", facultySchema);
module.exports = Faculty;