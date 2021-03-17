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
        required: [true, "Email cannot be empty"],
    },
    company: {
        type: String,
        required: [true, "Company cannot be empty"],
    },
    role: {
        type: String,
        required: [true, "Role must be selected"]
    },
    password: {
        type: String,
        required: [true, "Password required"],
    },
    firstLogin: {
        type: Boolean,
        required: true
    },
    ObjectId: String
})

const User = mongoose.model("User", UserSchema);
module.exports = User;