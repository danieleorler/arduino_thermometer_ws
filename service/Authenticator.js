class Authenticator {
	
	/**
	 * Constructor
	 * dao -> DataAccsesObject to retrieve users
	 * logger
	 */
	constructor(dao, logger) {
		this.dao = dao;
		this.logger = logger;
	}
	
	/**
	 * checks if the user identified by publicKey has access
	 * publicKey -> actually an apiKey
	 * params -> url query string parameters
	 * providedHash -> url query string parameters' hash sent by the user
	 */
	isAuthenticated(publicKey, params, providedHash) {
		return this.dao.getUserByPublicKey(publicKey)
			.then((user) => {
				let joinedParameters = this.joinParameters(params);
				let generatedHash = this.createHash(user.privateKey, joinedParameters);
				if(generatedHash === providedHash) {
					return true;
				} else {
					return false;
				}
			})
			.catch((error) => { return false; });
	}
	
	joinParameters(parameters) {
	    var joined = "";
	    for(var i in parameters) {
	        joined += parameters[i];
	    }
	    return joined;
	};
	
	createHash(privateKey, string) {
	    var crypto = require("crypto");
	    var to_hash = this.joinParameters({pk:privateKey,s:string});
	    var shasum = crypto.createHash("sha1");
	    shasum.update(to_hash);
	    var hash = shasum.digest("hex");
	    return hash;
	};
	
}

module.exports = Authenticator;
