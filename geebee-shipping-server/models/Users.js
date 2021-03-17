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
        required: true,
        match: [/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/, "Not a valid email address"]
    },
    company: {
        type: String,
        required: true,
        minlength: [2, "Not a valid company name"]
    },
    role: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be min 6 characters"]
    },
    firstLogin: {
        type: Boolean,
        required: true
    },
    ObjectId: String
})

const User = mongoose.model("User", UserSchema);
module.exports = User;