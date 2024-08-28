const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

function db() {
    const db = config.get('db');
    mongoose.connect(db)
        .then(() => winston.info(`Connected to ${db}...`));
}

module.exports = db;
