const express = require ('express');
const userModel = require('../models/Users.js');
const app = express();


//CRUD Operations
//Change routes
// Read ALL
// http://localhost:8081/users
app.get('/users', async (req, res) => { 
    const Users = await userModel.find({}); //Async function. Wait for results before posting
    try {
        res.send(Users);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

app.get('/dashboard', async (req, res) => { 
    //code for dashboard
});



module.exports = app;