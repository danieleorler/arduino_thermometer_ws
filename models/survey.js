var mongoose    = require('mongoose');
var db_url      = "mongodb://dalen:30mongo03@alex.mongohq.com:10004/thermometer";
var db          = mongoose.connect(db_url,function(err){if(err) throw err;});
var Schema      = mongoose.Schema;

//Mongoose DB Test
var SurveySchema = new Schema
({
    timestamp   : String,
    device      : String,
    temperature : Number
});

module.exports = mongoose.model("Survey", SurveySchema);
