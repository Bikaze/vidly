const {Customer, validateCustomer} = require('../models/customer');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.send(await Customer.find().sort('name'));
});

router.get('/:id', async (req, res) => {
    try{
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            throw new Error();
        }
        res.send(customer);
    } catch (e) {
        return res.status(404).send({'error': '404! Customer not Found'});
    }
});

router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send({
        error: error.details[0].message
    });

    let nuCustomer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });
    try {
        nuCustomer = await nuCustomer.save();
        res.send(nuCustomer);
    } catch (e) {
        res.status(500).send({error: 'Failed to Save the New Customer'});
    }
});

router.put('/:id', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send({
        error: error.details[0].message
    });

    try{
        const customer = await Customer.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
        if (!customer) {
            throw new Error();
        }
        res.send(customer);
    } catch (e) {
        res.status(404).send({'error': '404! Customer not Found'});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            throw new Error();
        }
        res.send(customer);
    } catch(e) {
        res.status(404).send({'error': '404! Customer not Found'});
    }
});

module.exports = router;
