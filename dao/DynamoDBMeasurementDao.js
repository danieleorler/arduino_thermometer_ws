var InternalErrorException = require("../exceptions/InternalErrorException.js");
var Measurement = require("../model/Measurement.js");

class DynamoDBMeasurementDao {
	
	constructor(dynamodb, logger) {
		this.db = dynamodb;
		this.logger = logger;
	}
	
	storeMeasurement(measurement) {
		let params = {
		    TableName: "arduino_thermometer.measurement",
		    Item: measurement
		};
		
		this.db.put(params).promise()
			.then((data) => {})
			.catch((error) => {
				this.logger.log("error", "Error " + JSON.stringify(error) + " saving survey: " + JSON.stringify(measurement));
		});
	}
	
	getLastMeasurement(device, sensor) {
		let measurement = new Measurement(device, sensor, null);
		let params = {
			TableName : "arduino_thermometer.measurement",
			KeyConditionExpression: "#id = :id",
			ExpressionAttributeNames:{
				"#id": "id"
			},
			ExpressionAttributeValues: {
				":id": measurement.id
			},
			Limit: 1,
			ScanIndexForward: false
		};
		
		return this.db.query(params).promise()
			.then((data) => {
				if(data.Items && data.Items.length > 0) {
					return data.Items[0];
				} else {
					return {};
				}
			})
			.catch((error) => {
				throw new InternalErrorException(error, "Error retrieving last measurement from database");
		});
	}
}

module.exports = DynamoDBMeasurementDao;