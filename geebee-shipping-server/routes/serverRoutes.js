const express = require('express');
const userModel = require('../models/Users.js');
const vehicleModel = require('../models/Vehicle.js')
const orderModel = require('../models/Orders.js')
const companyModel = require('../models/Companies.js')
const bcrypt = require('bcrypt')
const { json } = require('express');
const e = require('express');
const app = express();
const ObjectID = require('mongodb').ObjectID;
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

//GET for Order Schedule
app.get('/orders/:date', async (req, res) => {
    let OrderSchedule = await orderModel.find({ delivery_date: req.params.date });
    try {
        res.send(OrderSchedule);
    }
    catch (err) {
        res.status(500).send(err);
    }
})

//GET Orders for Specific Driver
app.get('/driver/orders/:userEmail', async (req, res) => {
    let DriverRoutes = await orderModel.find({ assigned_truck_driverEmail: req.params.userEmail });
    try {
        res.send(DriverRoutes);
    }
    catch (err) {
        console.log(err)
    }
})

//GET for Drivers
app.get('/users/:role', async (req, res) => {
    const Drivers = await userModel.find({ role: req.params.role }); //Async function. Wait for results before posting
    try {
        res.send(Drivers);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

app.get('/fleet/:class', async (req, res) => {
    const Trucks = await vehicleModel.find({ truck_class: req.params.class, vehicle_status: "In Service" });
    try {
        res.send(Trucks);
    }
    catch (err) {
        res.status(500).send(err);
    }
})

//==============================================POST FUNCTIONS==================================================//

//POST ==> Admin Creating New User

app.post('/admin/users/add', async (req, newUser) => {

    //Check if email exists in DB
    userModel.find({ email: req.body.email }, (err, exists) => {
        if (err) {
            newUser.send({
                message: "Entry Failed. Please try again."
            })
        }
        else if (exists.length > 0) {
            newUser.send({
                messageEmail: "Email Address already exists."
            })
        }
        else {
            //Check if company exists in DB
            companyModel.find({ company_name: req.body.company.toUpperCase() }, (err, companySearch) => {
                if (err) {
                    newUser.send({
                        message: "Company Search Failed. Please try again."
                    })
                }
                else if (companySearch.length < 1) {
                    newUser.send({
                        messageCompany: "Company Name Not Found."
                    })
                }
                else {
                    // generating salt password to hash and encrypt input pw
                    let saltRounds = 10
                    let salt = bcrypt.genSaltSync(saltRounds)
                    let securePassword = bcrypt.hashSync(req.body.password, salt)

                    let registeredUser = new userModel({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        phoneNumber: req.body.phoneNumber,
                        email: req.body.email,
                        company: req.body.company.toUpperCase(),
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
                            newUser.send({ success: true, message: "New User Created." })
                        }
                    })
                }

            })
        }
    })
})

//-----------------Needs to be worked - Delete when done
app.post('/admin/users/edit', async (req, editUser) => {

    //Check if email exists in DB
    userModel.find({ email: req.body.email }, (err, exists) => {
        if (err) {
            newUser.send({
                message: "Entry Failed. Please try again."
            })
        }
        else if (exists.length > 0) {
            newUser.send({
                messageEmail: "Email Address already exists."
            })
        }
        else {
            //Check if company exists in DB
            companyModel.find({ company_name: req.body.company.toUpperCase() }, (err, companySearch) => {
                if (err) {
                    newUser.send({
                        message: "Company Search Failed. Please try again."
                    })
                }
                else if (companySearch.length < 1) {
                    newUser.send({
                        messageCompany: "Company Name Not Found."
                    })
                }
                else {
                    // generating salt password to hash and encrypt input pw
                    let saltRounds = 10
                    let salt = bcrypt.genSaltSync(saltRounds)
                    let securePassword = bcrypt.hashSync(req.body.password, salt)

                    let registeredUser = new userModel({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        phoneNumber: req.body.phoneNumber,
                        email: req.body.email,
                        company: req.body.company.toUpperCase(),
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
                            newUser.send({ success: true, message: "New User Created." })
                        }
                    })
                }

            })
        }
    })
})

//POST for Login Form
app.post('/login', async (req, loginRes) => {
    var foundBool = false;
    var foundUser = "";

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
})

//POST for Companies Table
app.post('/admin/company-manager/add', async (req, company) => {
    await companyModel.find({ company_name: req.body.company_name.toUpperCase() }, (err, companySearch) => {
        if (err) {
            company.send({
                message: "Company Database Search Failed."
            })
        }
        else if (companySearch.length > 0) {
            company.send({
                message: "Company Already Exists in the Database."
            })
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

            newCompany.save((err, res) => {
                if (err) {
                    company.send({ message: "Failed to add Company." })
                }
                else {
                    company.send({ success: true, message: "Company successfully added." })
                }
            });
        }
    })
})



//POST for Adding New Truck to Database
app.post('/fleet/add', async (req, truck) => {

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
            truck.send({ success: true, message: "New truck added to fleet." });
        }
    });

})

//POST for Orders Table --- why is there 2?
app.post('/orders/add', async (req, order) => {

    let newOrder = new orderModel({
        order_date: new Date().toISOString().split('T')[0].toString(),
        delivery_date: req.body.deliveryDate.toString(),
        origin_address: req.body.origin_address.toUpperCase(),
        origin_city: req.body.origin_city.toUpperCase(),
        origin_postalCode: req.body.origin_postalCode.toUpperCase(),
        destination_address: req.body.dest_address.toUpperCase(),
        destination_city: req.body.dest_city.toUpperCase(),
        destination_postalCode: req.body.dest_postalCode.toUpperCase(),
        cargo_type: req.body.cargo_type.toUpperCase(),
        cargo_weight: req.body.cargo_weight,
        order_status: "Processing",
        assigned_truck_class: req.body.assigned_truckClass,
        assigned_truck_plate: req.body.assigned_truckPlate,
        assigned_truck_driverEmail: req.body.assigned_truckDriver

    });
    newOrder.save((err, res) => {
        if (err) {
            //error handling
            order.send({ message: "Error creating order." })
        }
        else {
            order.send({ success: true });
        }
    });
})

app.post('/admin/order-manager/schedule', async (req, order) => {

    let newOrder = new orderModel({
        order_date: req.body.order_date,
        delivery_date: req.body.deliveryDate,
        origin_address: req.body.origin_address,
        origin_city: req.body.origin_city,
        origin_postalCode: req.body.origin_postalCode,
        destination_address: req.body.dest_address,
        destination_city: req.body.dest_city,
        destination_postalCode: req.body.dest_postalCode,
        cargo_type: req.body.cargo_type,
        cargo_weight: req.body.cargo_weight,
        order_status: "Awaiting Delivery",
        assigned_truck_class: req.body.assigned_truckClass,
        assigned_truck_plate: req.body.assigned_truckPlate,
        assigned_truck_driverEmail: req.body.assigned_truckDriver //check if email in user db
    });

    newOrder.save((err, res) => {
        if (err) {
            //error handling
            order.send({ message: "Error creating order." })
        }
        else {
            order.send({ success: true });
        }
    });
})



//===========================================EDIT FUNCTIONS ===============================================

//POST ==> Edit User Profile
app.post('/profile', async (req, updateRes) => {
    //find the current data in the database and update
    let currPasswordDB = ''
    let currentUserData = ''
    let passwordCorrect = false;

    //Password encryption
    let saltRounds = 10
    let salt = bcrypt.genSaltSync(saltRounds)
    let securePassword = ''

    //Retrieve current data from db to get current password
    userModel.findById(req.body.userID, (err, found) => {

        if (err) {
            updateRes.send({ message: "User Not Found." })
        }
        else if (found != undefined) {
            //save data + dbPassword to variables
            currentUserData = found

            // ASSIGN THE PASSWORD
            currPasswordDB = currentUserData.password

            bcrypt.compare(req.body.currentPassword, currPasswordDB, (err, pwMatch) => {

                if (err) {
                    updateRes.send({ updateSuccess: false, message: "Incorrect Password" })
                }
                else if (pwMatch) {
                    currPasswordDB = req.body.currentPassword;
                    passwordCorrect = true;

                    if (req.body.newPassword == '') {
                        userModel.findByIdAndUpdate(req.body.userID, {
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            phoneNumber: req.body.phoneNumber,
                            email: req.body.email,
                            firstLogin: false
                        }, { useFindAndModify: false }, (err, res) => {
                            if (err) {
                                updateRes.send({ user: null, updateSuccess: false, message: "Incorrect Data." })
                            }
                            if (res) {
                                updateRes.send({ updateSuccess: true, message: "Update Successful." })
                            }
                            else {
                                updateRes.send({ user: null, updateSuccess: false, message: "Incorrect Data." })
                            }
                        })
                    }
                    //else swap replace dbPassword with newPassword
                    else {
                        securePassword = bcrypt.hashSync(req.body.newPassword, salt)
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
                                updateRes.send({ user: null, updateSuccess: false, message: "Incorrect Data." })
                            }
                        })
                    }
                }
                else {
                    updateRes.send({ updateSuccess: false, message: "Incorrect Password" })
                }
            })
        }
        else {
            updateRes.send({ updateSuccess: false, message: "Update Failed." })
        }
    })
})

//POST for Edit Companies Table
app.post('/admin/company-manager/edit', async (req, company) => {
    await companyModel.findOne({ company_name: req.body.previousCompanyName.toUpperCase() }, (err, companySearch) => {
        console.log(companySearch);
        if (err) {
            company.send({
                message: "Company Database Search Failed."
            })
        }
        else if (companySearch != null) {
            companySearch.company_name = req.body.company_name.toUpperCase(),
                companySearch.address = req.body.address.toUpperCase(),
                companySearch.city = req.body.city.toUpperCase(),
                companySearch.province = req.body.province.toUpperCase(),
                companySearch.postal_code = req.body.postal_code.toUpperCase(),
                companySearch.company_phone = req.body.company_phone,
                companySearch.save();
            company.send({ success: true, message: "Company successfully added." })
        } else {
            company.send({
                message: "Company Update unsucessful."
            })
        }
    })
})

//POST for Editing a Truck in the Database
app.post('/fleet/edit', async (req, truck) => {
    await vehicleModel.findOne({ license_plate: req.body.licensePlate.toUpperCase() }, (err, truckSearch) => {
        if (err) {
            truck.send({
                message: "Truck edit failed."
            })
        }
        else if (truckSearch != null) {
            truckSearch.vehicle_brand = req.body.brand.toUpperCase(),
                truckSearch.vehicle_model = req.body.model.toUpperCase(),
                truckSearch.vehicle_year = req.body.year,
                truckSearch.truck_class = req.body.truckClass,
                truckSearch.license_plate = req.body.licensePlate.toUpperCase(),
                truckSearch.vehicle_status = req.body.status
            truckSearch.save();
            truck.send({ success: true, message: "Truck successfully edited." })
        } else {
            truck.send({
                message: "Truck edit unsucessful."
            })
        }
    });
})

app.post('/order-manager/edit', async (req, order) => {

    await orderModel.findById(req.body.id, (err, orderSearch) => {
        if (err) {
            truck.send({
                message: "Order edit failed."
            })
        }
        else if (orderSearch != null) {
            orderSearch.order_date = req.body.orderDate,
            orderSearch.delivery_date = req.body.deliveryDate.toString(),
            orderSearch.origin_address = req.body.origin_address.toUpperCase(),
            orderSearch.origin_city = req.body.origin_city.toUpperCase(),
            orderSearch.origin_postalCode = req.body.origin_postalCode.toUpperCase(),
            orderSearch.destination_address = req.body.dest_address.toUpperCase(),
            orderSearch.destination_city = req.body.dest_city.toUpperCase(),
            orderSearch.destination_postalCode = req.body.dest_postalCode.toUpperCase(),
            orderSearch.cargo_type = req.body.cargo_type.toUpperCase(),
            orderSearch.cargo_weight = req.body.cargo_weight,
            orderSearch.order_status = "Assigned",
            orderSearch.assigned_truck_class = req.body.assigned_truckClass,
            orderSearch.assigned_truck_plate = req.body.assigned_truckPlate,
            orderSearch.assigned_truck_driverEmail = req.body.assigned_truckDriver
            orderSearch.save();
            order.send({ success: true, message: "Order successfully edited." })
        } else {
            console.log("Order not found");
            order.send({
                message: "Order edit unsucessful."
            })
        }
    })
});

//===========================================DELETE FUNCTIONS ===============================================
app.post('/admin/company-manager/delete', async (req, res) => {
    await companyModel.findOneAndDelete({ company_name: req.body.company_name.toUpperCase() }, (err, docs) => {
        if (err) {
            console.log(err)
            res.send({ success: false, message: "Company delete failed." })
        } else if (docs != null) {
            console.log("Deleted Company : ", docs);
            res.send({ success: true, message: "Company successfully deleted." })
        }
        else {
            console.log("Deleted Company : ", docs);
            res.send({ success: true, message: "Company successfully deleted." })
        }
    })
});

app.post('/admin/order-manager/delete', async (req, order) => {
    await orderModel.findByIdAndDelete(req.body._id, (err, docs) => {
        if (err) {
            console.log(err)
            order.send({ success: false, message: "Order delete failed." })
        } else if (docs != null) {
            console.log("Deleted Order : ", docs);
            order.send({ success: true, message: "Order successfully deleted." })
        } else {
            console.log("Deleted order : ", docs);
        }
    })
});

app.post('/admin/user-manager/delete', async (req, user) => {
    await companyModel.findByIdAndDelete({ company_name: req.body.company_name.toUpperCase() }, (err, docs) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Deleted User : ", docs);
        }
    })
});


module.exports = app;