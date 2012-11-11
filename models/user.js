var mongoose    = require('mongoose');
var db_url      = "mongodb://dalen:30mongo03@alex.mongohq.com:10004/thermometer";
var db          = mongoose.connect(db_url,function(err){if(err) throw err;});
var Schema      = mongoose.Schema;

//Mongoose DB Test
var UserSchema = new Schema
({
    name    : String,
    surname : String,
    email   : String,
    password: String
});

module.exports = mongoose.model("User", UserSchema);
