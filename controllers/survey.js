


exports.insert = function(req,resp)
{
    var Survey = require('../models/survey.js');
    var logger = require('../controllers/logger.js');

    var srvy = new Survey();

    srvy.device     = req.query.device;
    srvy.timestamp  = req.query.timestamp;
    srvy.temperature= req.query.temperature;

    srvy.save(function(err,survey)
    {
        if(err)
            logger.log('error', 'Unable to save the survey', {params: req.querys});

        if(survey)
            logger.log('info', 'Survey saved succesfully', {}, function (err, level, msg, meta) { console.log(err); });
    });
};