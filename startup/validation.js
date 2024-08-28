const Joi = require('joi');

function validate() {
    Joi.objectId = require('joi-objectid')(Joi);
}

module.exports = validate;
