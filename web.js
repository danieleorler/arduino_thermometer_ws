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
var Authenticator = require("./service/Authenticator.js");
var MeasurementService = require("./service/MeasurementService.js");

var DynamoDBUserDao = require("./dao/DynamoDBUserDao.js");
var DynamoDBMeasurementDao = require("./dao/DynamoDBMeasurementDao.js");

var dynamoDBUserDao = new DynamoDBUserDao(dynamodb, logger);
var dynamoDBMeasurementDao = new DynamoDBMeasurementDao(dynamodb, logger);

var authenticator = new Authenticator(dynamoDBUserDao, logger);
var measurementService = new MeasurementService(dynamoDBMeasurementDao);

var Measurement = require("./model/Measurement.js");

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

app.get("/", function(request, response)
{
    var now = new Date();
    response.send("Hello World!! "+now);
});

app.get("/rest/survey/insert", function(req, res)
{
	let measurement = new Measurement(req.query.device, req.query.sensor, req.query.temperature);
    
	try {
		measurementService.insert(measurement);
		res.status(200).send("Processing survey");
	} catch(e) {
		logger.log("error", e.message, e.value);
		res.status(400).send(e.message);
	}
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