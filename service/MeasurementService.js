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
	
	lastMeasurement(device, sensor) {
		return this.dao.getLastMeasurement(device, sensor);
	}
	
	measurementsByPeriod(device, sensor, from, to) {
		return Promise.resolve()
			.then( () => {
				if(from.length !== 13) {
					throw new InvalidArgumentException(from, "The lower bound of the specified period is invalid");
				}
				if(to && to < from) {
					throw new InvalidArgumentException(from, "The lower bound of the specified period must be greater than the lower bound");
				}
				if(to === undefined) {
					to = (Date.now()).toString();
				}
				return this.dao.getMeasurementsByPeriod(device, sensor, from, to);
			});
	}
	
}

module.exports = MeasurementService;