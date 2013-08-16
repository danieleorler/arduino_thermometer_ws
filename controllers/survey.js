exports.insert = function(req,resp)
{
    var Survey = require('../models/survey.js');
    var logger = require('../controllers/logger.js');

    var srvy = new Survey();

    srvy.device     = req.query.device;
    srvy.timestamp  = Date.now();
    srvy.sensor     = req.query.sensor;
    srvy.temperature= req.query.temperature/100;

    srvy.save(function(err,survey)
    {
        if(err)
            logger.log('error', 'Unable to save the survey', err);
    });
};

exports.findByPeriod = function(req,resp)
{
    var Survey = require('../models/survey.js');
    var logger = require('../controllers/logger.js');

    if(req.query.from.length == 13)
    {
        if(req.query.to == undefined)
            req.query.to = Date.now();

        Survey
        .find()
        .select('sensor temperature timestamp')
        .where('timestamp').gt(req.query.from).lt(req.query.to)
        .where('sensor').equals(req.query.sensor)
        .where('device').equals(req.query.device)
        .exec(function(error, result)
        {
            if(error)
            {
                logger.log('error', 'Unable to retrieve the surveys', error);
                resp.send(400,error);
            }

            resp.send(200,result);
        });
    }
    else
    {
        logger.log('error', 'From timestamp not correct', req.query);
        resp.send(400,"parameters incorrect");
    }
}

exports.lastMeasure = function(req,resp)
{
    var Survey = require('../models/survey.js');
    var logger = require('../controllers/logger.js');

    Survey
    .find()
    .select('sensor temperature device timestamp')
    .where('sensor').equals(req.query.sensor)
    .where('device').equals(req.query.device)
    .sort('-_id')
    .limit(1)
    .exec(function(error, result)
    {
        if(error)
        {
            logger.log('error', 'Unable to retrieve last measure', error);
            resp.send(400,error);
        }

        resp.send(200,result[0]);
    });
}