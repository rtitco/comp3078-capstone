const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstLogin: {
        type: Boolean,
        required: true
    }
})

const User = mongoose.model("User", UserSchema);
module.exports = User;