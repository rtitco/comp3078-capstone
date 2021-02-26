const mongoose = require('mongoose');

var CompanySchema = new mongoose.Schema({
    company_name: String,
    address: String,
    city: String,
    province: String,
    postal_code: String,
    company_phone: String
})

const Company = mongoose.model("Company", CompanySchema);
module.exports = Company;