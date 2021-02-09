const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    // phonenumber: {
    //     type: String,
    //     required: true
    // }
})

const User = mongoose.model("User", UserSchema);
module.exports = User;