const express = require('express');
const userModel = require('../models/Users.js');
const vehicleModel = require('../models/Vehicles.js')
const orderModel = require('../models/Orders.js')
const itemModel = require('../models/Items.js')
const companyModel = require('../models/Companies.js')

const app = express();

//CRUD Operations + routes

//GET for Users Table for Admin
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

module.exports = app;