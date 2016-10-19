var assert = require("assert");
var AWS = require("aws-sdk");
var DynamoDBMeasurementDao = require("../../dao/DynamoDBMeasurementDao.js");
var Measurement = require("../../model/Measurement.js");
var MeasurementService = require("../../service/MeasurementService.js");
var InvalidArgumentException = require("../../exceptions/InvalidArgumentException.js");
var sinon = require("sinon");

describe("MeasurementService.js", () => {
	
    describe("#insert", function() {
	
		let dao = null;
		let measurementService = null;
		let stub = null;
		beforeEach(() => {
			dao = new DynamoDBMeasurementDao(null, null);
    		stub = sinon.stub(dao, "storeMeasurement", (a) => {});
    		measurementService = new MeasurementService(dao);
		});
		
    	it("should throw exception when temperature out of range", function() {
    		let measurement = new Measurement("viabasse", "in", -50000);
    		let throwEx = () => { measurementService.insert(measurement); };
    		assert(!stub.called);
    		assert.throws(throwEx, InvalidArgumentException);
    	});
    	
    	it("should store a valid measurement", function() {
    		let measurement = new Measurement("viabasse", "in", 0);
    		measurementService.insert(measurement);
    		
    		assert(stub.called);
    	});
	});
    
    describe("#measurementsByPeriod", function() {
    	
		let dao = null;
		let measurementService = null;
		let stub = null;
		let items = [
	        {
	            "temperature": -1.23,
	            "sensor": "in",
	            "id": "viabasse_in",
	            "device": "viabasse",
	            "timestamp": "1476622947579"
	        },
	        {
	            "temperature": 10,
	            "sensor": "in",
	            "id": "viabasse_in",
	            "device": "viabasse",
	            "timestamp": "1476622881674"
	        },
	        {
	            "temperature": 9,
	            "sensor": "in",
	            "id": "viabasse_in",
	            "device": "viabasse",
	            "timestamp": "1476620456704"
	        }
	    ];
		
		
		beforeEach(() => {
			dao = new DynamoDBMeasurementDao(null, null);
    		stub = sinon.stub(dao, "getMeasurementsByPeriod", (device, sensor, from, to) => {
    			return new Promise((resolve, reject) => { resolve(items); });
    		});
    		measurementService = new MeasurementService(dao);
		});
		
    	it("should throw exception when the form parameter is not correct", function(done) {
    		measurementService.measurementsByPeriod("viabasse", "in", "50000")
    			.catch( (error) => { assert(error instanceof InvalidArgumentException); done(); });
    	});
    	
    	it("should throw exception when the to is < than from", function(done) {
    		measurementService.measurementsByPeriod("viabasse", "in", "1476622947579", "1476620456704")
				.catch( (error) => { assert(error instanceof InvalidArgumentException); done(); });
    	});
    	
    	it("should return a list of measurements", function(done) {
    		measurementService.measurementsByPeriod("viabasse", "in", "1476622947578", "1476622947579")
    			.then( (result) => { assert.deepEqual(items, result); done(); });
    	});
    	
    	it("should return a list of measurements even when the to parameter is null", function(done) {
    		measurementService.measurementsByPeriod("viabasse", "in", "1476622947578")
    			.then( (result) => { assert.deepEqual(items, result); done(); });
    	});
	});
});