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
    },
    company: {
        type: String,
    },
    role: {
        type: String,
    },
    password: {
        type: String,
    },
    firstLogin: {
        type: Boolean,
        required: true
    },
    ObjectId: String
})

const User = mongoose.model("User", UserSchema);
module.exports = User;