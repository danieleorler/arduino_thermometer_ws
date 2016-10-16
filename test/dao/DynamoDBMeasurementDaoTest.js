var assert = require("assert");
var AWS = require("aws-sdk");
var DynamoDBMeasurementDao = require("../../dao/DynamoDBMeasurementDao.js");
var InternalErrorException = require("../../exceptions/InternalErrorException.js");
var sinon = require("sinon");

describe("DynamoDBMeasurementDao.js", () => {
	
	let dynamodb = new AWS.DynamoDB.DocumentClient();
	
	let dummyQuery = {
		promise: () => {}
	};
	let lastMeasurement = {
		"Items": [
			{
				"temperature": 10,
				"sensor": "in",
				"id": "viabasse_in",
				"device": "viabasse",
				"timestamp": "1476620468102"
			}
		],
		"Count": 1,
		"ScannedCount": 1,
		"LastEvaluatedKey": {
			"id": "viabasse_in",
			"timestamp": "1476620468102"
		}
	};
	
	before(() => { sinon.stub(dynamodb, "query", () => { return dummyQuery; }); });
	
    describe("#getLastMeasurement(device, sensor)", function()
    {

        it("should return the last measurement", (done) => {
    		sinon.stub(dummyQuery, "promise", () => {
    			return new Promise((resolve, reject) => { resolve(lastMeasurement); });
    		});
    		let dao = new DynamoDBMeasurementDao(dynamodb, null);
    		dao.getLastMeasurement("viabasse", "in")
    			.then((measurement) => { assert.deepEqual(lastMeasurement.Items[0], measurement); done(); });
        	
        });
        
        it("should return an empty object when there is no last measurement", (done) => {
        	dummyQuery.promise.restore();
    		sinon.stub(dummyQuery, "promise", () => {
    			return new Promise((resolve, reject) => { resolve({"Items": []}); });
    		});
    		let dao = new DynamoDBMeasurementDao(dynamodb, null);
    		dao.getLastMeasurement("viabasse", "in")
    			.then((measurement) => { assert.deepEqual({}, measurement); done(); });
        	
        });
        
        it("should return an empty object when the db response's Item property is not defined", (done) => {
        	dummyQuery.promise.restore();
    		sinon.stub(dummyQuery, "promise", () => {
    			return new Promise((resolve, reject) => { resolve({}); });
    		});
    		let dao = new DynamoDBMeasurementDao(dynamodb, null);
    		dao.getLastMeasurement("viabasse", "in")
    			.then((measurement) => { assert.deepEqual({}, measurement); done(); });
        	
        });
        
        it("should throw an exception when an error arises communicating with the db", (done) => {
        	dummyQuery.promise.restore();
    		sinon.stub(dummyQuery, "promise", () => {
    			return new Promise((resolve, reject) => { reject({}); });
    		});
    		let dao = new DynamoDBMeasurementDao(dynamodb, null);
    		dao.getLastMeasurement("viabasse", "in")
    			.catch((error) => { assert(error instanceof InternalErrorException); done(); });
        	
        });
    });
	
	
});