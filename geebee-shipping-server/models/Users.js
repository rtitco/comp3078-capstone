const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    /*
    phonenumber: {
        type: String,
        required: true
    },
    company_id: String, //FOREIGN KEY
    
    */
})

const User = mongoose.model("User", UserSchema);
module.exports = User;