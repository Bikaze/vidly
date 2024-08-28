const validateObjectId = require('../middleware/validateObjectId');
const {Genre, ValidateGenre} = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();

router.get('/', async (_, res) => {
    res.send(await Genre.find().sort('name').select('_id name'));
});

router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id).select('_id name');
    if (!genre) return res.status(404).send({'error': '404! Genre not Found'});
    res.send(genre);
});

router.post('/', auth, async (req, res) => {
    const { error } = ValidateGenre(req.body);

    if (error) return res.status(400).send({
        error: error.details[0].message
    });

    const nuGenre = new Genre({
        name: req.body.name
    });
    await nuGenre.save();
    res.send(nuGenre);
});

router.put('/:id', async (req, res) => {
    const { error } = ValidateGenre(req.body);
    if (error) return res.status(400).send({
        error: error.details[0].message
    });
    try {
        const genre = await Genre.findByIdAndUpdate(req.params.id, { $set: req.body}, { new: true });
        res.send(genre);
    } catch (e) {
        res.status(404).send({'error': '404! Genre not Found'});
    }
});

router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const genre = await Genre.findByIdAndDelete(req.params.id);
        if (!genre) {
            throw new Error();
        }
        res.send(genre);
    } catch(e) {
        res.status(404).send({'error': '404! Genre not Found'});
    }
});

module.exports = router;
