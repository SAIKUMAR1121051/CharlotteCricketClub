var express = require('express');
var router = express.Router();
var connectionDB = require('./../utilities/connectionDB');
var connection = require('./../models/connection');
var userProfileDB = require('../utilities/UserProfileDB.js');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var { check, validationResult } = require('express-validator');

/**
  * renders the index page when the request type is get
  * @function
 */
router.get('/', function (req, res) {
  res.render('index', { session: req.session.userSession })
})

/**
  * renders the index page when the request type is get
  * @function
 */
router.get('/index', function (req, res) {
  res.render('index', { session: req.session.userSession });
});

/**
  * renders the about page when the request type is get
  * @function
 */
router.get('/about', function (req, res) {
  res.render('about', { session: req.session.userSession });
});

/**
  * renders the contact us page when the request type is get
  * @function
 */
router.get('/contact', function (req, res) {
  res.render('contact', { session: req.session.userSession });
});

/**
  * renders the new connection page when the request type is get
  * enables user to enter details for the new connection
  * @function
 */
router.get('/newConnection', function (req, res) {
  if (req.session.userSession) {
    res.render('newConnection', { session: req.session.userSession , errors:null});
  }
  else {
    res.redirect('login');
  }

});

/**
  * adds the new connection details to the database
  * redirects to saved connection page once the connection is added
  * if any error render the new connection page and displays errors
  * @function
 */
router.post('/newConnection', urlencodedParser, [
  check('topic').trim().not().isEmpty().withMessage('topic should not be empty').isLength({ min: 3 }).withMessage('topic should be atleast 3 chars long')
    ,
  check('name').trim().not().isEmpty().withMessage('name should not be empty').isLength({ min: 3 }).withMessage('name should be atleast 3 chars long')
   ,
  check('details').trim().not().isEmpty().withMessage('details should not be empty').isLength({ min: 10 }).withMessage('details should be atleast 10 chars long')
  ,
  check('when').trim().not().isEmpty().withMessage('date time should not be empty')
  .custom((value, {req})=>{
    var currentDateTime = new Date().toJSON().split('T')[0];
     var enteredValue = req.body.when;
     var valueEntered= enteredValue.split('T')[0];
     if(valueEntered <= currentDateTime)
     {
       throw new Error('date should be after current date');
     }
     return true;
  }),
  check('where').trim().not().isEmpty().withMessage('Location should not be empty').isLength({ min: 3 }).withMessage('Location should be atleast 3 chars long')
], function (req, res) {

  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    var errorsArray = errors.array();
    return res.render('newConnection', { session: req.session.userSession, errors: errorsArray });
  }
  if (req.session.userSession) {
    if (req.body != undefined) {
      var connectionTopic = req.body.topic;
      var connectionName = req.body.name;
      var details = req.body.details;
      var dateandTime = req.body.when;
      var venue = req.body.where;
      var splitItem = dateandTime.split('T');
      var dateTime = splitItem[0] + " " + splitItem[1];
      var userID = (req.session.userSession).userID;


      connectionDB.validateConnection(connectionName, connectionTopic).exec().then((isPresent)=>{
        if(isPresent){
          var conObj = new connection(isPresent.connectionID, connectionName, connectionTopic, details, dateTime, venue);
          userProfileDB.addConnection(conObj, userID).then((item) => {
            res.redirect('savedConnections');
          }).catch((err) => { console.log(err); });
        }
        else{
          connectionDB.getLastConnectionID().exec().then((value) => {
            var lastConnectionID = value[0].connectionID;
            var conObj = new connection((parseInt(lastConnectionID) + 1), connectionName, connectionTopic, details, dateTime, venue);
            userProfileDB.addConnection(conObj, userID).then((item) => {
              res.redirect('savedConnections');
            }).catch((err) => { console.log(err); });
          }).catch((err) => { console.log(err); });
        }
      })
    
    }
    else {
      response.redirect('404');
    }
  }
  else {
    res.redirect('login');
  }
});


/**
  * gets the connection details from the database from the connection Id query param
  * if any error redirecrs to the connections page
  * @function
 */
router.get('/connection', function (request, response) {
  if ((Object.keys(request.query)).length != 0) {
    if (request.query.id != null && request.query.id != "" && /^\d+$/.test(request.query.id) ) {
      connectionDB.getConnection(request.query.id).exec().then((conn) => {
        if(conn){
          var connectionItem = new connection(conn.connectionID, conn.connectionName, conn.topic, conn.details, conn.dateandTime, conn.venue);
          if (connectionItem.getConnectionID == null || connectionItem.getConnectionID == undefined) {
            response.redirect('Connections');
          }
          else {
            response.render('connection', { connection: connectionItem, session: request.session.userSession });
          }
        }
        else{
          response.redirect('Connections');
        }
      });

    }
    else {
      response.redirect('Connections');
    }
  }
  else {
    response.redirect('Connections');
  }
});

/**
  * gets the connection details from the database from the connection Id query param
  * if any error redirecrs to the connections page
  * @function
 */
router.post('/connection', function (request, response) {
  if ((Object.keys(request.query)).length != 0) {
    if (request.query.id != null && request.query.id != ""&& /^\d+$/.test(request.query.id)) {
      connectionDB.getConnection(request.query.id).exec().then((conn) => {
        if(conn){
          var connectionItem = new connection(conn.connectionID, conn.connectionName, conn.topic, conn.details, conn.dateandTime, conn.venue);
          if (connectionItem.getConnectionID == null || connectionItem.getConnectionID == undefined) {
            response.redirect('Connections');
          }
          else {
            response.render('connection', { connection: connectionItem, session: request.session.userSession });
          }
        }
        else{
          response.redirect('Connections');
        }
      });
    }
    else {
      response.redirect('Connections');
    }
  }
  else {
    response.redirect('Connections');
  }
});


/**
  * gets all the connection details from the database 
  * @function
 */
router.get('/Connections', function (request, response) {
  connectionDB.getConnections().exec().then((data) => {
    var myConnections = [];
    data.forEach(conn => {
      myConnections.push(new connection(conn.connectionID, conn.connectionName, conn.topic, conn.details, conn.dateandTime, conn.venue));
    });
    connectionDB.addCategories().exec().then((categories) => {
      var myCategories = [];
      categories.forEach(function (dataItem) {
        if (!myCategories.includes(dataItem.topic)) {
          myCategories.push(dataItem.topic);
        }
      });
      response.render('Connections', { myConnections: myConnections, myCategories: myCategories, session: request.session.userSession });
    });
  });
});

module.exports = router;
