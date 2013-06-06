var winston = require('winston'),
    couchdb = require('../lib/winston-couchdb'),
    config  = require('../config');

winston.add(couchdb, config.couchdb);

module.exports = winston;