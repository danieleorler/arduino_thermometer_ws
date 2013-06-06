var config = {};

config.mongohq_url = "mongodb://dalen:30mongo03@alex.mongohq.com:10004/thermometer";

config.couchdb =
{
    host : 'dalen.cloudant.com',
    port : 443,
    db   : 'arduinothermometer_log',
    user : 'dalen',
    pass : '30couchdb03',
    ssl  : false
}