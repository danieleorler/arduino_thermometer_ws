
exports.joinParameters = function(parameters)
{
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

exports.authenticate = function(user, request)
{
    if(user)
    {
        var generatedHash = exports.createHash(user.privateKey, exports.joinParameters(request.query));
        if(generatedHash == request.get("ard-hash"))
    	{
        	return {"ok": true};
    	}
        else
        {
            return {"ok": false, "status": 403, "message": "You are not authorized!"};
        }
    }
    else
    {
        return {"ok": false, "status": 403, "message": "Your apiKey was not recognized!"};
    }
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

        var result = exports.authenticate(user, req);
        if(result.ok)
        {
        	next();
        }
        else
    	{
        	logger.log('error', result.message, req.query);
        	res.status(result.status).send(result.message);
    	}
    });
}