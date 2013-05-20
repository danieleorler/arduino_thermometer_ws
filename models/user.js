var mongoose    = require('mongoose');

var UserSchema = new mongoose.Schema
({
    name        : String,
    publicKey   : String,
    privateKey  : String
});

module.exports = mongoose.model("User", UserSchema);
