
exports.joinParameters = function(parameters)
{
    var logger = require('../controllers/logger.js');
    var joined = '';

    logger.log('info', 'Merging parameters: %j', parameters);

    for(i in parameters)
    {
        joined += parameters[i];
    }

    // console.log('3 - joined parameters: '+joined);

    return joined;
};

exports.createHash = function(privateKey, string)
{
    var crypto = require('crypto');

    var to_hash = exports.joinParameters({pk:privateKey,s:string});
    var shasum = crypto.createHash('sha1');
    shasum.update(to_hash);

    var hash = shasum.digest('hex');

    // console.log('4 - hash is: '+hash);

    return hash;
}

exports.isAuthenticated = function(req, res, next)
{
    var User = require('../models/user.js');
    var logger = require('../controllers/logger.js');


    logger.log('info', 'Request parameters: %j', req.query);

    User.findOne({publicKey : req.get("ard-apikey")}, function(err, user)
    {
        if(err) throw err;

        // console.log('2 - user found');

        if(user)
        {
            var generatedHash = exports.createHash(user.privateKey, exports.joinParameters(req.query));

            logger.log('info', 'Hash should be: %s', generatedHash);

            if(generatedHash == req.get("ard-hash"))
                next();
            else
                res.send(403, 'You are not authorized!');
        }
        else
        {
            res.send(403, 'Your apiKey was not recognized!');
        }
    });
}