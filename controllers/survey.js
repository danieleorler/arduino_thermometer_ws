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