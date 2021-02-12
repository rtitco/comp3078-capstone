const mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
    order_id: String,
    order_date: Date,
    order_status: String,
    est_delivery_date: Date,
    order_items: {
        item_id: String,
        order_amount: Number
    },
    destination: {
        user_id: String,
        company_id: String
    }
})

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;