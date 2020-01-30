const Joi = require('joi');

module.exports = {
    name: Joi.string().min(3).max(60).required(),
    surname: Joi.string().min(3).max(60).required(),
    birthday: Joi.string().required(),
    phone: Joi.string().regex(/^0\d{9}$/, {name: 'phone number (0xxyyyyyyy)'}).required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('dev','qa','pm','admin').required(),
    gender: Joi.string().valid('male','female')
};
