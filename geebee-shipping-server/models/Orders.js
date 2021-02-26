const mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
    order_date: String,
    delivery_date: String,
    destination_street: String,
    destination_city: String,
    destination_postalCode: String,
    order_status: String
})

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;