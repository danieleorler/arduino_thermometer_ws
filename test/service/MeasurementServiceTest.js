var assert = require("assert");
var AWS = require("aws-sdk");
var DynamoDBMeasurementDao = require("../../dao/DynamoDBMeasurementDao.js");
var Measurement = require("../../model/Measurement.js");
var MeasurementService = require("../../service/MeasurementService.js");
var InvalidArgumentException = require("../../exceptions/InvalidArgumentException.js");
var sinon = require("sinon");

describe("MeasurementService.js", () => {
	
    describe("#isAuthenticated", function() {
	
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
});