var assert = require("assert");
var Authenticator = require("../lib/Authenticator.js");
var DynamoDBUserDao = require("../dao/DynamoDBUserDao.js");
var sinon = require("sinon");

describe("Authenticator.js", function()
{
	let authenticator = new Authenticator(null, null);
	
    describe("#joinParameters({parameters})", function()
    {
        it("should return all the parameters concatenated", function()
        {
            assert.equal("viabasse12321.3", authenticator.joinParameters({"device":"viabasse","timestamp":123,"temperature":21.3}));
            assert.equal("viabassein2130", authenticator.joinParameters({"device":"viabasse","sensor":"in","temperature":2130}));
            assert.equal("", authenticator.joinParameters({}));
        });
    });


    describe("#createHash(privateKey,string)", function()
    {
        it("should return the hash", function()
        {
            assert.equal("acc5d55a9f2c530f7d202a49f92e45f567c5ce5a",authenticator.createHash("yioAA8sp","viabasse12321.3"));
            assert.equal("3922bf7fc1e70bf052094431a0db08043c177d21",authenticator.createHash("yioAA8sp","viabassein2130"));
            assert.equal("f29df3d56b82d6992a2d7168da0ab502bc1cfb0f",authenticator.createHash("yioAA8sp",""));
        });
    });
    
    describe("#isAuthenticated", function()
	{
    	let dao = new DynamoDBUserDao(null, null);
    	
    	let user = {
			"publicKey": "WgorEbGv",
			"privateKey": "yioAA8sp",
			"name": "viabasse"
		};
    	
    	beforeEach(() => {
    		dao = new DynamoDBUserDao(null, null);
        });
    	
    	it("should correctly authenticate request", function(done)
		{
    		sinon.stub(dao, "getUserByPublicKey", () => {
    			console.log("mocked");
    			return new Promise((resolve, reject) => { resolve(user); });
			});
    		
    		authenticator = new Authenticator(dao, null);
    		
    		let params = {"device":"viabasse","sensor":"in","temperature":2130};
    		let providedHash = "3922bf7fc1e70bf052094431a0db08043c177d21";
    		
    		authenticator.isAuthenticated("WgorEbGv", params, providedHash)
    			.then((result) => { assert.ok(result); done(); });
    	});
    	
    	it("should detect when the provided hash is wrong", function(done)
		{
    		sinon.stub(dao, "getUserByPublicKey", () => {
    			console.log("mocked");
    			return new Promise((resolve, reject) => { resolve(user); });
			});
    		
    		authenticator = new Authenticator(dao, null);
    		
    		let params = {"device":"viabasse","sensor":"in","temperature":2130};
    		let providedHash = "asdgh";
    		
    		authenticator.isAuthenticated("WgorEbGv", params, providedHash)
    			.then((result) => { assert.ok(!result); done(); });
    	});
    	
    	it("should not authenticate an unknown publicKey", function(done)
		{
    		sinon.stub(dao, "getUserByPublicKey", () => {
    			console.log("mocked");
    			return new Promise((resolve, reject) => { reject(); });
			});
    		
    		authenticator = new Authenticator(dao, null);
    		
    		let params = {"device":"viabasse","sensor":"in","temperature":2130};
    		let providedHash = "3922bf7fc1e70bf052094431a0db08043c177d21";
    		
    		authenticator.isAuthenticated("WgorEbGvL", params, providedHash)
    			.then((result) => { assert.ok(!result); done(); });
    	});
    	
	});

});