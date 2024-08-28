const {User} = require('../models/user');
const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const router = express.Router()


router.post('/', async (req, res) => {
    const { error } = validateAuth(req.body);
    if (error) return res.status(400).send({error: error.details[0].message});

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({error: "Invalid Email or Password."});

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send({error: "Invalid Email or Password."});

    const token = user.generateAuthToken();
    res.send(token);
});

function validateAuth(user) {
    const schema = Joi.object({
        email: Joi.string().min(10).max(50).required().email(),
        password: Joi.string().min(12).max(255).required()
    });

    return schema.validate(user);
}

module.exports = router;
