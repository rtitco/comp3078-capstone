const mongoose = require('mongoose')

const registerTemplate = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // triggered when user is created
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('geebeeshipping', registerTemplate)