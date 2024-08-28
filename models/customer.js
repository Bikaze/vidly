const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        require: true,
        minlength: 10,
        maxlength: 10
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(course) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean(),
        phone: Joi.string(). min(10).max(10).required()
    });

    return schema.validate(course);
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
