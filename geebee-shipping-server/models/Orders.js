const mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
    order_date: String,
    delivery_date: String,
    origin_address: String,
    origin_city: String,
    origin_postalCode: String,
    destination_address: String,
    destination_city: String,
    destination_postalCode: String,
    cargo_weight: Number,
    cargo_type: String,
    order_status: String,
    assigned_truck_class: String,
    assigned_truck_plate: String,
    assigned_truck_driverEmail: String
})

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;