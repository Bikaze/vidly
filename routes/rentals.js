const express = require('express');
const router = express.Router();
const { Rental, validateRental } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');


router.get('/', async (_, res) => {
    const rentals = await Rental
                            .find()
                            .sort('-dateOut')
                            .populate('customer', 'name')
                            .populate('movie', 'title genre.name');
    res.send(rentals)
});

router.get('/:id', async (req, res) => {
    const rental = await Rental
                            .findById(req.params.id)
                            .populate('customer', 'name')
                            .populate('movie', 'title genre.name');
    if (!rental) return res.status(404).send({'error': '404! Rental not Found'});
    res.send(rental);
});

router.post('/', async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send({error: error.details[0].message});

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid Customer!');
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid Movie!');

    const newEntries = (({customerId: customer, movieId: movie, ...rest}) =>
        ({customer, movie, ...rest})
        )(req.body);
    
    let nuRental = new Rental(newEntries);
    nuRental = await nuRental.save();

    movie.numberInStock--;
    movie.save();
    
    res.send(nuRental);
});

router.put('/:id', async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send({error: error.details[0].message});

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid Customer!');
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid Movie!');

    const newEntries = (({customerId: customer, movieId: movie, ...rest}) =>
    ({customer, movie, ...rest})
    )(req.body);

    const rental = await Rental.findByIdAndUpdate(req.params.id, { $set: newEntries }, { new: true });
    res.send(rental);
});

router.delete('/:id', async (req, res) => {
    const rental = await Rental.findByIdAndDelete(req.params.id);
    if (!rental) return res.status(404).send({'error': '404! Rental not Found'});
    res.send(rental);
});

module.exports = router;
