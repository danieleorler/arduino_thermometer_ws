var assert = require("assert");
var AWS = require("aws-sdk");
var DynamoDBUserDao = require("../../dao/DynamoDBUserDao.js");
var sinon = require("sinon");

describe("DynamoDBUserDao.js", () => {
	
	let dynamodb = new AWS.DynamoDB.DocumentClient();
	
	let dummyGet = {
		promise: () => {}
	};
	let userItem = {
		"Item": {
			"publicKey": "WgorEbGv",
			"privateKey": "yioAA8sp",
			"name": "viabasse"
		}
	};
	
	before(() => { sinon.stub(dynamodb, "get", () => { return dummyGet; }); });
	
    describe("#getUserByPublicKey(apiKey)", function()
    {

        it("should return the user object", (done) => {
    		sinon.stub(dummyGet, "promise", () => {
    			return new Promise((resolve, reject) => { resolve(userItem); });
    		});
    		let dao = new DynamoDBUserDao(dynamodb, null);
    		dao.getUserByPublicKey("apikey")
    			.then((user) => { assert.deepEqual(userItem.Item, user); done(); });
        	
        });
        
        it("should throw exception when user not found", (done) => {
        	var AuthenticationException = require("../../exceptions/AuthenticationException.js");
        	dummyGet.promise.restore();
        	sinon.stub(dummyGet, "promise", () => {
    			return new Promise((resolve, reject) => { resolve({}); });
    		});
    		let dao = new DynamoDBUserDao(dynamodb, null);
    		dao.getUserByPublicKey("apikey")
    			.then((user) => { assert(false, "should throw an exception"); })
    			.catch((error) => { assert(error instanceof AuthenticationException); done(); });
        	
        });
        
        it("should throw exception when database error", (done) => {
        	var InternalErrorException = require("../../exceptions/InternalErrorException.js");
        	dummyGet.promise.restore();
        	sinon.stub(dummyGet, "promise", () => {
    			return new Promise((resolve, reject) => { reject({"error": "db error"}); });
    		});
    		let dao = new DynamoDBUserDao(dynamodb, null);
    		dao.getUserByPublicKey("apikey")
    			.then((user) => { assert(false, "should throw an exception"); })
    			.catch((error) => { assert(error instanceof InternalErrorException); done(); });
        	
        });
    });
	
	
});