var winston = require('winston'),
    couchdb = require('../lib/winston-couchdb');

winston.add(couchdb, {
    host : 'dalen.cloudant.com',
    port : 443,
    db   : 'arduinothermometer_log',
    user : 'dalen',
    pass : '30couchdb03',
    ssl  : false
});

module.exports = winston;