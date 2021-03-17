const express = require ('express');
const serverRouter = require('./routes/serverRoutes.js')
const mongoose = require('mongoose');
const cors = require('cors');
var bodyParser = require('body-parser')


const app = express(); //app uses express
app.use(express.json()); //data stored as JSON in db
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

//connect to mongo db 
mongoose.connect('mongodb+srv://busybee:busybee123@capstone.9de0p.mongodb.net/busybee-shipping?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(cors());
app.use(serverRouter); //use the routes

app.listen(8081, () => { console.log("Server is running...")}); //declare the port