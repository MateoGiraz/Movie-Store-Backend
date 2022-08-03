const mongoose = require('mongoose');
const Joi = require('joi');

const CustomerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean, 
        required: true, 
        default: false
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String, 
        required: true
    }
})

const Customer = mongoose.model('Customer', CustomerSchema);

function validateCustomer(customer){
    const JoiSchema = new Joi.object({
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(8).required(),
        isGold: Joi.boolean().required(),
    });
    return JoiSchema.validate(customer)
}

module.exports.Customer = Customer;
module.exports.CustomerSchema = CustomerSchema;
exports.validate = validateCustomer;