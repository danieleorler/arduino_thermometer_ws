var express = require('express');
var User = require('./models/user.js');
var app = express();

app.get('/', function(request, response)
{
    var user        = new User();
    user.name       = "Test";
    user.surname    = "User";
    user.email      = "test@skodeg-o.com";
    user.password   = "password";
    user.save(function(err,user)
    {
        if(err)
            console.log(err);
        if(user)
            console.log("User: "+ user.email + " saved!");
    });

    response.send('Hello World!!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});