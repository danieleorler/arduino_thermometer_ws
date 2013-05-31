
exports.joinParameters = function(parameters)
{
    var logger = require('../controllers/logger.js');
    var joined = '';

    for(i in parameters)
    {
        joined += parameters[i];
    }

    return joined;
};

exports.createHash = function(privateKey, string)
{
    var crypto = require('crypto');

    var to_hash = exports.joinParameters({pk:privateKey,s:string});
    var shasum = crypto.createHash('sha1');
    shasum.update(to_hash);

    var hash = shasum.digest('hex');

    return hash;
}

exports.isAuthenticated = function(req, res, next)
{
    var User = require('../models/user.js');
    var logger = require('../controllers/logger.js');


    User.findOne({publicKey : req.get("ard-apikey")}, function(err, user)
    {
        if(err)
        {
            logger.log('error', 'You are not authorized!', err);
            throw err;
        }

        if(user)
        {
            var generatedHash = exports.createHash(user.privateKey, exports.joinParameters(req.query));

            if(generatedHash == req.get("ard-hash"))
                next();
            else
            {
                logger.log('error', 'You are not authorized!', req.query);
                res.send(403, 'You are not authorized!');
            }
        }
        else
        {
            logger.log('error', 'Your apiKey was not recognized!', req.query);
            res.send(403, 'Your apiKey was not recognized!');
        }
    });
}