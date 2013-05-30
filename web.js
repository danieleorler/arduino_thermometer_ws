var express = require('express');
var app = express();
var auth = require('./controllers/auth.js');
var logger = require('./controllers/logger.js');

var mongoose    = require('mongoose');
var db_url      = "mongodb://dalen:30mongo03@alex.mongohq.com:10004/thermometer";
mongoose.connect(db_url,function(err){if(err) throw err;});


app.use('/rest',function(req,res,next)
{
    auth.isAuthenticated(req,res,next);
});


app.get('/', function(request, response)
{
    // var user        = new User();
    // user.name       = "Test";
    // user.surname    = "User";
    // user.email      = "test@skodeg-o.com";
    // user.password   = "password";
    // user.save(function(err,user)
    // {
    //     if(err)
    //         console.log(err);
    //     if(user)
    //         console.log("User: "+ user.email + " saved!");
    // });
    var now = new Date();
    response.send('Hello World!!'+now);
});

app.get('/rest/survey/insert', function(request, response)
{
    var survey = require('./controllers/survey.js');
    survey.insert(request,response);

    response.send(200,'Processing survey');
});

// app.get('/user/add/:name/:publicKey/:privateKey', function(req,res)
// {
//     var user = new User();
//     user.name = 'viabasse';
//     user.publicKey = req.params.publicKey;
//     user.privateKey = req.params.privateKey;

//     user.save(function(err,usr)
//     {
//         if(err)
//             console.log(err);
//         if(usr)
//             response.send("User "+usr.name+" saved");

//     });

// });

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});