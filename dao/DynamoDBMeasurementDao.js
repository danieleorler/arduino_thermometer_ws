var InternalErrorException = require("../exceptions/InternalErrorException.js");

class DynamoDBMeasurementDao {
	
	constructor(dynamodb, logger) {
		this.db = dynamodb;
		this.logger = logger;
	}
	
	storeMeasurement(measurement) {
		let params = {
		    TableName: "Measurement",
		    Item: {
		    	timestamp: measurement.timestamp,
		    	sensor: measurement.sensor,
		    	temperature: measurement.temperature,
		    	device: measurement.device
		    }
		};
		
		this.db.put(params).promise()
			.then((data) => {})
			.catch((error) => {
				this.logger.log("error", "Error " + JSON.stringify(error) + " saving survey: " + JSON.stringify(measurement));
		});
	}
}

module.exports = DynamoDBMeasurementDao;