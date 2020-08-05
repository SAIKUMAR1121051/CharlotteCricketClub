var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/CCCenter", { useNewUrlParser: true , useUnifiedTopology: true  });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
var express = require('express');
var app = express();
app.set('view engine','ejs');
app.use('/assets',express.static('assets'));
app.use('/partials', express.static('partials'));
var session = require('express-session');
app.use(session({secret: "ssssss"}));

// if the database connection is open the app starts listening to the port number and also imports all the route methods
db.once("open", function(){
  var controller = require('./routes/controller');
  var UserController = require('./routes/UserController');
  app.use('/',controller);
  app.use('/',UserController);
  app.listen(5454, function(){
    console.log('Yola! Listening to port 5454');
  });
});



