const express = require('express');
const userModel = require('../models/Users.js');
const vehicleModel = require('../models/Vehicle.js')
const orderModel = require('../models/Orders.js')
const companyModel = require('../models/Companies.js')
const bcrypt = require('bcrypt')
// const store = require('store2');
const { json } = require('express');
const e = require('express');
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
    let rgx_user_email = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    let rgx_user_pw = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_])[A-Za-z\d@$!%*?&\-_]{8,}$/;

    //check for empty fields
    if (req.body.password.length < 6 || req.body.email.length < 1 || req.body.company.length < 1) {
        newUser.send({ message: "Fields cannot be empty." })
    }
    else if (req.body.email.match(rgx_user_email) == null) {
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
                if (req.body.password.match(rgx_user_pw) == null) {
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
app.post('/admin/company-manager/add', async (req, company) => {
    let rgx_company_name = /^([A-Za-z]{1}[a-z]{1,}){1}([ ]{0,1}([A-Za-z]{1}[a-z]{1,}))*$/
    let rgx_company_address = /^([\d]{1,5}[a-mA-M]{0,1}){1}[ ]{0,1}([A-Za-z]{1}[a-z]{1,}[ ]{0,1}){1,}$/;
    let rgx_company_city = /^([A-Za-z]{1}[a-z]{1,}){1}([ ]{0,1}([A-Za-z]{1}[a-z]{1,}))*$/;
    let rgx_company_postalCode = /^([a-zA-z]{1}[\d]{1}[a-zA-z]{1}){1}[ ]{0,1}([\d]{1}[a-zA-z]{1}[\d]{1}){1}$/;
    let rgx_company_phone = /^[+]{0,1}[\d]*[- ]{0,1}([\d]{3}[- ]{0,1}){2}[\d]{4}$/;

    if (req.body.company_name.length < 1 || req.body.address.length < 1 || req.body.city.length < 1 ||
        req.body.province.length < 1 || req.body.postal_code.length < 1 || req.body.company_phone.length < 1) {
        company.send({ message: "Fields cannot be empty." })
    }
    else if (req.body.company_name.match(rgx_company_name) == null) {
        company.send({ messageCompany: "Invalid company name.", message: "Failed to add." })
    }
    else if (req.body.address.match(rgx_company_address) == null) {
        company.send({ messageAddress: "Invalid Address", message: "Failed to add." })
    }
    else if (req.body.city.match(rgx_company_city) == null) {
        company.send({ messageCity: "Invalid City", message: "Failed to add." })
    }
    else if (req.body.postal_code.match(rgx_company_postalCode) == null) {
        company.send({ messagePostalCode: "Invalid Postal Code", message: "Failed to add." })
    }
    else if (req.body.company_phone.match(rgx_company_phone) == null) {
        company.send({ messagePhone: "Invalid Phone Number", message: "Failed to add." })
    }
    else {
        let newCompany = new companyModel({
            company_name: req.body.company_name.toUpperCase(),
            address: req.body.address.toUpperCase(),
            city: req.body.city.toUpperCase(),
            province: req.body.province.toUpperCase(),
            postal_code: req.body.postal_code.toUpperCase(),
            company_phone: req.body.company_phone,
        });
        await newCompany.save((err) => {
            if (err) {
                //error handling
                company.send({ message: "Failed to add." })
            }
            else {
                company.send({ success: true, message: "Company successfully added." })
            }
        });
    }

})

//POST for Adding New Truck to Database
app.post('/fleet/add', async (req, truck) => {
    let rgx_truck_brand = /^[a-zA-Z]{3,}$/;
    let rgx_truck_model = /^[a-zA-Z\d]{3,}$/;
    let rgx_truck_year = /^[\d]{4}$/;
    let rgx_truck_plate = /^[A-Za-z]{3,5}[ ]{0,1}[\d]{3,5}$/;

    //CHECK FOR EMPTY FIELDS
    if (req.body.brand.length < 1 || req.body.model.length < 1 ||
        req.body.year.length < 1 || req.body.licensePlate.length < 1 ||
        req.body.truckClass.length < 1 || req.body.status.length < 1) {
        truck.send({ message: "Fields cannot be empty." })
    }
    //IF FIELDS NOT EMPTY:
    else if (req.body.brand.match(rgx_truck_brand) == null) {
        truck.send({
            messageBrand: "Brand must contain only letters",
            message: "Failed to add new truck."
        })
    }
    else if (req.body.model.match(rgx_truck_model) == null) {
        truck.send({
            messageModel: "Model can only contain letters or numbers",
            message: "Failed to add new truck."
        })
    }
    else if (req.body.year.match(rgx_truck_year) == null) {
        truck.send({
            messageYear: "Invalid year.",
            message: "Failed to add new truck."
        })
    }
    else if (req.body.year <= 1990 || req.body.year >= 2022) {
        truck.send({
            messageYear: "Invalid year.",
            message: "Failed to add new truck."
        })
    }
    else if (req.body.licensePlate.match(rgx_truck_plate) == null) {
        truck.send({
            messageLicensePlate: "Invalid license plate.",
            message: "Failed to add new truck."
        })
    }
    else {
        let newTruck = new vehicleModel({
            vehicle_brand: req.body.brand.toUpperCase(),
            vehicle_model: req.body.model.toUpperCase(),
            vehicle_year: req.body.year,
            truck_class: req.body.truckClass,
            license_plate: req.body.licensePlate.toUpperCase(),
            vehicle_status: req.body.status
        });
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