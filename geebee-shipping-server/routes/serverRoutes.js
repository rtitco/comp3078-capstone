const express = require('express');
const userModel = require('../models/Users.js');
const vehicleModel = require('../models/Vehicles.js')
const orderModel = require('../models/Orders.js')
const itemModel = require('../models/Items.js')
const companyModel = require('../models/Companies.js')
const bcrypt = require('bcrypt')
const store = require('store2');
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
app.get('/vehicles', async (req, res) => {
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

//GET for Items
app.get('/items', async (req, res) => {
    const Items = await itemModel.find({}); //Async function. Wait for results before posting
    try {
        res.send(Items);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

//==============================================POST FUNCTIONS==================================================//

//POST for Login Form
app.post('/login', async (req, loginRes) => {
    console.log(req.body.email)
    //get the email and pw from the req.body
    //find user with email in db
    var foundBool = false;
    var foundUser = "";
    await userModel.find({ email: req.body.email }, (err, userRes) => {
        console.log("========================")
        console.log(userRes)
        foundBool = true;
        foundUser = userRes
    });
    if (foundBool) {
        //check if the req.body.password matches the db entry
        await bcrypt.compare(req.body.password, foundUser.password, (err, res) => {
            store("currentUser", foundUser);
            console.log("RESULTS: ")
            console.log(store("currentUser"));
            loginRes.redirect('http://localhost:3000/dashboard/admin')//This isn't working
        })
        // console.log("Wrong password.")
    }
})

//POST for Users Table
app.post('/register', async (req, res) => {
    // generating salt password to hash and encrypt
    console.log(req)
    const saltPassword = await bcrypt.genSalt(10)
    const securePassword = await bcrypt.hash(req.body.password, saltPassword)

    const registeredUser = new userModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        company: req.body.company,
        password: securePassword
    })
    registeredUser.save()
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            res.json(error)
        })
})

//POST for Companies Table
app.post('/companies', async (req, res) => {
    const newCompany = new companyModel(req.body);
    try {
        await newCompany.save((err) => {
            if (err) {
                //error handling
                res.send(err)
            }
            else {
                res.send(newCompany);
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

//POST for Items Table
app.post('/items', async (req, res) => {
    const newItem = new itemModel(req.body);
    try {
        await newItem.save((err) => {
            if (err) {
                //error handling
                res.send(err)
            }
            else {
                res.send(newItem);
            }
        });
    }
    catch (err) {
        res.status(500).send(err);
    }
})

module.exports = app;