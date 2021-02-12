const mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
    item_id: String,
    item_name: String,
    item_availability: String,
    amount_per_order: String
})

const Item = mongoose.model("Item", ItemSchema);
module.exports = Item;