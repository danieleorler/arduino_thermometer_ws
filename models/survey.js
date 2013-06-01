
var mongoose    = require('mongoose');

var SurveySchema = new mongoose.Schema
({
    timestamp   : String,
    device      : String,
    sensor      : String,
    temperature : Number
});

module.exports = mongoose.model("Survey", SurveySchema);
