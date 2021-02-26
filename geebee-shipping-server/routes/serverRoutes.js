const express = require('express');
const userModel = require('../models/Users.js');
const vehicleModel = require('../models/Vehicle.js')
const orderModel = require('../models/Orders.js')
const companyModel = require('../models/Companies.js')
const bcrypt = require('bcrypt')
// const store = require('store2');
const { json } = require('express');
const app = express();
// const router = express.Router();

//CRUD Operations + routes

//==============================================GET FUNCTIONS==================================================//

//GET for Users Table
app.get('/users', async (req, res) => {
    const Users = await userModel.find({}); //Async function. Wait for results before posting
    try {
        res.send(Users);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

//GET for Companies
app.get('/companies', async (req, res) => {
    const Companies = await companyModel.find({}); //Async function. Wait for results before posting
    try {
        res.send(Companies);
    }
    catch (err) {
        res.status(500).send(err);
    }
});


//GET for Trucks
app.get('/fleet', async (req, res) => {
    const Vehicles = await vehicleModel.find({}); //Async function. Wait for results before posting
    try {
        res.send(Vehicles);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

//GET for Orders
app.get('/orders', async (req, res) => {
    const Orders = await orderModel.find({}); //Async function. Wait for results before posting
    try {
        res.send(Orders);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

//==============================================POST FUNCTIONS==================================================//

//POST ==> Admin Creating New User
app.post('/admin/users/add', async (req, newUser) => {
    // generating salt password to hash and encrypt
    console.log("PRE POST")
    console.log(req.body)
    const saltPassword = await bcrypt.genSalt(10)
    const securePassword = await bcrypt.hash(req.body.password, saltPassword)

    const registeredUser = new userModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        company: req.body.company,
        role: req.body.role,
        password: securePassword,
        firstLogin: true
    })
    registeredUser.save( (err, res) => {
        if (err){
            newUser.send({message: "Incorrect Email/Password Provided." })
        }
        else{
            newUser.send({message: "New User Created." })
        }
    })
        // .then(data => {
        //     res.json(data)
        // })
        // .catch(error => {
        //     res.json(error)
        // })
})

//POST for Login Form
app.post('/login', async (req, loginRes) => {
    //get the email and pw from the req.body
    //find user with email in db
    var foundBool = false;
    var foundUser = "";

    //find matching email address in the database
    //check if email or password fields are empty
    if (req.body.email.length < 1 || req.body.password.length < 1) {
        loginRes.send({ success: false, message: "Fields cannot be empty." })
    }
    else {
        await userModel.find({ email: req.body.email }, (err, userRes) => {
            if (err) {
                loginRes.send({success: false, message: "Incorrect Email/Password Provided." })
            }
            if (userRes) {
                foundBool = true;
                foundUser = userRes[0]
            }
        });

        if (foundBool) {
            //check if the req.body.password matches the db entry
            bcrypt.compare(req.body.password, foundUser.password, (err, res) => {
                console.log("Comparing")
                if (err) {
                    // console.log("Error")
                    loginRes.send({success: false, message: "Incorrect Email/Password Provided." })
                }
                if (res) {
                    // console.log("Successfully Logged in")
                    loginRes.send({ user: foundUser, success: true, message: "Login Successful." })
                } else {
                    // console.log("In Else")
                    loginRes.send({success: false, message: "Incorrect Email/Password Provided." })
                }
            })
        }
        else {
            loginRes.send({success: false, message: "Incorrect Email/Password Provided." })
        }
    }

    //if email found, check for pw

})

//POST ==> Updating User Profile
app.post('/profile', async (req, updateRes) => {
    if (true) {
        //hash the input password
        const saltPassword = await bcrypt.genSalt(10)
        const securePassword = await bcrypt.hash(req.body.password, saltPassword)

        //find the entry in the database and update the data
        userModel.findByIdAndUpdate(req.body.userID, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            password: securePassword,
            firstLogin: false
        }, { useFindAndModify: false }, (err, res) => {
            if (err) {
                updateRes.send({ user: null, updateSuccess: false, message: "Incorrect Data." })
            }
            if (res) {
                updateRes.send({ updateSuccess: true, message: "Update Successful." })
            }
            else {
                // console.log("In Else")
                updateRes.send({ user: null, updateSuccess: false, message: "Incorrect Data." })
            }
        })
    }
})

//POST for Companies Table
app.post('/admin/company-manager/add', async (req, res) => {
    console.log(req.body);
    const newCompany = new companyModel(req.body);
    try {
        await newCompany.save((err) => {
            if (err) {
                //error handling
                res.send(err)
            }
            else {
                res.send({success: true})
            }
        });
    }
    catch (err) {
        res.status(500).send(err);
    }
})

//POST for Trucks Table
app.post('/trucks', async (req, res) => {
    const newTruck = new vehicleModel(req.body);
    try {
        await newTruck.save((err) => {
            if (err) {
                //error handling
                res.send(err)
            }
            else {
                res.send(newTruck);
            }
        });
    }
    catch (err) {
        res.status(500).send(err);
    }
})

//POST for Orders Table
app.post('/orders', async (req, res) => {
    const newOrder = new orderModel(req.body);
    try {
        await newOrder.save((err) => {
            if (err) {
                //error handling
                res.send(err)
            }
            else {
                res.send(newOrder);
            }
        });
    }
    catch (err) {
        res.status(500).send(err);
    }
})

module.exports = app;