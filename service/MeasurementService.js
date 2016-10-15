var InvalidArgumentException = require("../exceptions/InvalidArgumentException.js");

class MeasurementService {
	
	constructor(dao) {
		this.dao = dao;
	}
	
	insert(measurement) {
	    if(measurement.temperature > 50 || measurement.temperature < -50) {
	        throw new InvalidArgumentException(measurement, "The temperature is outside the range");
	    } else {
	    	this.dao.storeMeasurement(measurement);
	    }
	}
	
}

module.exports = MeasurementService;