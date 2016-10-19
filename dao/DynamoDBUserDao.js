var AuthenticationException = require("../exceptions/AuthenticationException.js");
var InternalErrorException = require("../exceptions/InternalErrorException.js");

class DynamoDBUserDao {
	
	constructor(dynamodb, logger) {
		this.db = dynamodb;
		this.logger = logger;
	}
	
	getUserByPublicKey(publicKey) {
		
		let params = {
		    TableName: "arduino_thermometer.user",
		    Key: {
		        publicKey: publicKey
		    }
		};
		
		let getUser = this.db.get(params).promise();
		
		return getUser
			.then((data) => {
				if(data.Item) {
					return data.Item;
				} else {
					throw new AuthenticationException("User not found");
				}
			})
			.catch((error) => {
				switch(error.constructor) {
					case AuthenticationException:
						throw error;
					default:
						throw new InternalErrorException(error, "Error communicating with the database");
				}
				
			});
	}
}

module.exports = DynamoDBUserDao;