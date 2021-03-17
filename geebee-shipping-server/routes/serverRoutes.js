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

    //check for empty fields
    if (req.body.password.length < 6 || req.body.email.length < 1 || req.body.company.length < 1) {
        newUser.send({ message: "Fields cannot be empty." })
    }
    else {
        //regex email
        if (req.body.email.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/) == null) {
            newUser.send({
                messageEmail: "Invalid email address."
            })
        }
        else {
            //check for existing email
            await userModel.find({ email: req.body.email }, (err, exists) => {
                if (err) {
                    newUser.send({
                        message: "Entry Failed. Please try again."
                    })
                }
                if (exists.length > 0) {
                    newUser.send({
                        messageEmail: "Email Address already exists."
                    })
                }
                //no existing accounts with email
                else {
                    //regex password
                    if (req.body.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_])[A-Za-z\d@$!%*?&\-_]{8,}$/) == null) {
                        newUser.send({
                            message: "Entry Failed. Please try again.",
                            messagePw: "Passwords must be at least 6 characters in length, and include at least one(1) Capital letter, one(1) lowercase, one(1) number, and one(1) special character @$!%*?&-_"
                        })
                    }
                    else {
                        // generating salt password to hash and encrypt input pw
                        const saltPassword = bcrypt.genSalt(10)
                        const securePassword = bcrypt.hash(req.body.password, saltPassword)

                        let registeredUser = new userModel({
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            phoneNumber: req.body.phoneNumber,
                            email: req.body.email,
                            company: req.body.company,
                            role: req.body.role,
                            password: securePassword,
                            firstLogin: true
                        })
                        //try to save entry
                        registeredUser.save((err, res) => {
                            if (err) {
                                newUser.send({
                                    message: "Failed to create user. Please try again.",
                                })
                            }
                            else {
                                newUser.send({ message: "New User Created." })
                            }
                        })
                    }
                }
            })

        }
    }
})

//POST for Login Form
app.post('/login', async (req, loginRes) => {
    var foundBool = false;
    var foundUser = "";

    //check if email or password fields are empty from req.body
    if (req.body.email.length < 1 || req.body.password.length < 1) {
        loginRes.send({ success: false, message: "Fields cannot be empty." })
    }
    else {
        //find matching email address in the database
        await userModel.find({ email: req.body.email }, (err, userRes) => {
            if (err) {
                loginRes.send({ success: false, message: "Incorrect Email/Password Provided." })
            }
            //if db entry found, save to foundUser
            if (userRes.length > 0) {
                foundBool = true;
                foundUser = userRes[0]
            }
            else {
                loginRes.send({ message: "Incorrect Email/Password Provided." })
            }
        });

        if (foundBool) {
            //check if the req.body.password matches the db entry
            bcrypt.compare(req.body.password, foundUser.password, (err, res) => {
                if (err) {
                    loginRes.send({ success: false, message: "Incorrect Email/Password Provided." })
                }
                if (res == true) {
                    loginRes.send({ user: foundUser, success: true, message: "Login Successful." })
                }
                if (res == false) {
                    loginRes.send({ success: false, message: "Incorrect Email/Password Provided." })
                }
            })
        }
    }
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
    let newCompany = new companyModel(req.body);
    try {
        await newCompany.save((err) => {
            if (err) {
                //error handling
                res.send(err)
            }
            else {
                res.send({ success: true })
            }
        });
    }
    catch (err) {
        res.status(500).send(err);
    }
})

//POST for Adding New Truck to Database
app.post('/fleet/add', async (req, truck) => {
    let newTruck = new vehicleModel({
        vehicleBrand: req.body.brand,
        vehicleModel: req.body.model,
        vehicle_year: req.body.year,
        truck_class: req.body.truckClass,
        license_plate: req.body.licensePlate,
        status: req.body.status
    });
    try {
        await newTruck.save((err, res) => {
            if (err) {
                //error handling
                truck.send({ message: "Failed to add new truck." })
            }
            else {
                truck.send({ message: "New truck added to fleet." });
            }
        });
    }
    catch (err) {
        res.status(500).send(err);

    }
})

//POST for Orders Table
app.post('/orders/add', async (req, order) => {
    let newOrder = new orderModel({
        order_date: new Date().toISOString().split('T')[0].toString(),
        delivery_date: req.body.deliveryDate.toString(),
        destination_street: req.body.street,
        destination_city: req.body.city,
        destination_postalCode: req.body.postalCode,
        order_status: "Processing"
    });
    newOrder.save((err, res) => {
        if (err) {
            //error handling
            order.send({ message: "Error creating order." })
        }
        else {
            order.send({ message: "Order completed." });
        }
    });
})

module.exports = app;