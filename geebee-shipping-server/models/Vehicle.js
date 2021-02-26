const mongoose = require('mongoose');

var VehicleSchema = new mongoose.Schema({
    vehicle_brand: String,
    vehicle_model: String, 
    vehicle_year: Number,
    truck_class: Number,
    license_plate: String,
    vehicle_status: String, //Available, In Use, etc.
})

const Vehicle = mongoose.model("Vehicle", VehicleSchema);
module.exports = Vehicle;