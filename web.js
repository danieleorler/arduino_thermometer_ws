var express = require("express");
var app = express();
var AWS = require("aws-sdk");
var logger = require("./controllers/logger.js");
var config = require("./config.js");

let AuthenticationException = require("./exceptions/AuthenticationException.js");
let InternalErrorException = require("./exceptions/InternalErrorException.js");

var mongoose    = require("mongoose");
var db_url      = config.mongohq_url;
mongoose.connect(db_url,function(err){if(err) throw err;});

AWS.config.update({
	  region: config.dynamodb.region,
	  endpoint: config.dynamodb.endpoint,
	  accessKeyId: config.dynamodb.accessKeyId,
	  secretAccessKey: config.dynamodb.secretAccessKey
});

var dynamodb = new AWS.DynamoDB.DocumentClient();
var Authenticator = require("./lib/Authenticator.js");
var DynamoDBUserDao = require("./dao/DynamoDBUserDao.js");

var dynamoDBUserDao = new DynamoDBUserDao(dynamodb, logger);
var authenticator = new Authenticator(dynamoDBUserDao, logger);

app.use("/rest",function(req,res,next)
{
	authenticator.isAuthenticated(req.get("ard-apikey"), req.query, req.get("ard-hash"))
	.then((allowed) => {
		if(allowed) {
			next();
		} else {
			res.status(401).send("You are not allowed to access this resource");
		}
	})
	.catch((error) => {
		res.status(500).send("Internal error");
	});
});

app.get("/rest/survey/insert2", function(request, response) {
  let AWS = require("aws-sdk");
  

  
  let dynamodb = new AWS.DynamoDB.DocumentClient();

  let DynamoDBUserDao = require("./dao/DynamoDBUserDao.js");
  let dynamoDBUserDao = new DynamoDBUserDao(dynamodb, null);
  
  let getUser = dynamoDBUserDao.getUserByPublicKey(request.query.k);
  
  getUser
  	.then((user) => { response.status(200).send(user); })
  	.catch((error) => {
  		switch (error.constructor) {
  			case AuthenticationException:
  				console.log(error.constructor);
  				return response.status(401).send(error);
  			case InternalErrorException:
  				console.log(error.constructor);
  				return response.status(500).send(error);
  			default:
  				console.log(error.constructor);
  				return response.status(500).send(error);
  		}
  	});
});

app.get("/", function(request, response)
{
    var now = new Date();
    response.send("Hello World!! "+now);
});

app.get("/rest/survey/insert", function(request, response)
{
    var survey = require("./controllers/survey.js");
    survey.insert(request,response);

    response.send(200,"Processing survey");
});

app.get("/survey", function(request, response)
{
    var survey = require("./controllers/survey.js");
    survey.findByPeriod(request,response);
});

app.get("/survey/last", function(request, response)
{
    var survey = require("./controllers/survey.js");
    survey.lastMeasure(request,response);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});