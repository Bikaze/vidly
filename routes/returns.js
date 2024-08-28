const moment = require('moment');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const Joi = require('joi');
const {Rental} = require('../models/rental');
const express = require('express');
const { Movie } = require('../models/movie');
const router = express.Router();


router.post('/', [auth, validate(validateReturn)], async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if (!rental) return res.status(404).send('Rental not found.');

    if (rental.dateReturned) return res.status(400).send('Return already processed.');

    rental.dateReturned = new Date();
    const rentalDays = moment().diff(rental.dateOut, 'days');
    const movie = await Movie.findById(rental.movie);
    rental.rentalFee =  rentalDays * movie.dailyRentalRate;
    movie.numberInStock += 1;
    await movie.save();
    await rental.save();

    return res.send(rental);
});

function validateReturn(req) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    });

    return schema.validate(req);
}

module.exports = router;
