const mongoose = require('mongoose');

var CompanySchema = new mongoose.Schema({
    company_id: String,
    company_name: String,
    company_address: {
        building_no: Number,
        street_name: String,
        city: String,
        postal_code: String
    },
    company_phone: String
})

const Company = mongoose.model("Company", CompanySchema);
module.exports = Company;