var assert = require("assert");
var auth = require("../controllers/auth.js");

describe('Auth', function()
{
    describe('joinParameters({parameters})', function()
    {
        it('should return all the parameters concatenated', function()
        {
            assert.equal("viabasse12321.3", auth.joinParameters({"device":"viabasse","timestamp":123,"temperature":21.3}));
            assert.equal("viabassein2130", auth.joinParameters({"device":"viabasse","sensor":"in","temperature":2130}));
            assert.equal("", auth.joinParameters({}));
        });
    });


    describe('createHash(privateKey,string)', function()
    {
        it('should return the hash', function()
        {
            assert.equal("acc5d55a9f2c530f7d202a49f92e45f567c5ce5a",auth.createHash("yioAA8sp","viabasse12321.3"));
            assert.equal("3922bf7fc1e70bf052094431a0db08043c177d21",auth.createHash("yioAA8sp","viabassein2130"));
            assert.equal("f29df3d56b82d6992a2d7168da0ab502bc1cfb0f",auth.createHash("yioAA8sp",""));
        });
    });

});