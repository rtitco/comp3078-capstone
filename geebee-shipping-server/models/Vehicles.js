const mongoose = require('mongoose');

var VehicleSchema = new mongoose.Schema({
    vehicle_type: String, //Truck or Trailer
    vehicle_model: String, //licence plate, null if trailer
    vehicle_licensePlate: {
        type: String,
        required: false
    },
    vehicle_status: String, //Available, In Use, etc.
    vehicle_driver: { //foreign key!
        driver_id: String,
        required: false
    }
})

const Vehicle = mongoose.model("Vehicle", VehicleSchema);
module.exports = Vehicle;