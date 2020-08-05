var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var Connection = require('../models/connection.js');
var UserConnection = require('../models/UserConnection.js');
var user = require('../models/User.js');
var connectionDB = require('../utilities/connectionDB.js');
var userDB = require('../utilities/UserDB.js');
var userProfileDB = require('../utilities/UserProfileDB.js');
var { check, validationResult } = require('express-validator');
'use strict';
var crypto = require('crypto');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function (length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, length);   /** return required number of characters */
};


/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function (password, salt) {
  var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  var value = hash.digest('hex');
  return {
    salt: salt,
    passwordHash: value
  };
};

/**
 * validates whether entered text is an email or not
 * @function
 * @param {string} email - email of the user.
 */
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**
 * routes to login page when request type is GET
 * @function
 */
router.get('/login', function (req, res) {
  if (req.session.userSession) {
    res.redirect('savedConnections');
  }
  else {
    if(req.query.user){
      var signUpMsg= [{
        "location": "body",
        "msg": "User Successfully signedUp",
        "param": "notification"
      }]
      res.render('login', {session:undefined, errors:signUpMsg})
    }
    else{
      res.render('login', { session: undefined, errors: null });
    }
  }
});

/**
 * routes to signUp page when request type is GET
 * @function
 */
router.get('/signUp', function (req, res) {
  if (req.session.userSession) {
    res.redirect('savedConnections');
  }
  else {
    res.render('signUp', { errors: null });
  }
});

/**
 * route for signUp page when request type is post. 
 * Adds an user to the database
 * @function
 */
router.post('/signUp', urlencodedParser, [
  check('userID').trim().not().isEmpty().withMessage('userID should not be empty').isLength({ min: 5 }).withMessage('userID should be atleast 5 chars long'),

  check('fname').trim().not().isEmpty().withMessage('first name should not be empty')
  .matches(/^[a-z ]+$/i)
  .withMessage("can only contain letters and spaces"),

  check('lname').trim().not().isEmpty().withMessage('last name should not be empty')
  .matches(/^[a-z ]+$/i)
  .withMessage("can only contain letters and spaces"),

  check('email').trim().not().isEmpty().withMessage('email should not be empty').isEmail().normalizeEmail().withMessage('please enter valid email'),
  check('password', 'The password must be 5+ chars long and contain a number').trim()
    .not().isIn(['123', 'password', 'god']).withMessage('Do not use a common word as the password')
    .isLength({ min: 5 })
    .matches(/\d/),
  check('RePassword').trim().not().isEmpty().withMessage('Re-Password should not be empty').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password does not match. Please check again');
    }
    return true;
  }),

  check('add1').trim().not().isEmpty().withMessage('address Line 1 should not be empty'),
  check('city').trim().not().isEmpty().withMessage('city should not be empty')
  .matches(/^[a-z ]+$/i)
  .withMessage("can only contain letters and spaces"),

  check('state').trim().not().isEmpty().withMessage('state should not be empty')
  .matches(/^[a-z ]+$/i)
  .withMessage("can only contain letters and spaces"),

  check('country').trim().not().isEmpty().withMessage('country should not be empty')
  .matches(/^[a-z ]+$/i)
  .withMessage("can only contain letters and spaces"),

  check('zipcode').trim().not().isEmpty().withMessage('zipcode should not be empty').isNumeric().withMessage('only numbers are allowed')
],
  function (req, res) {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      var errorsArray = errors.array();
      return res.render('signUp', { errors: errorsArray });
    }
    else{
      if (req.body) {
          var userID= req.body.userID;
          var fname= req.body.fname;
          var lname= req.body.lname;
          var email= req.body.email;
          var password= req.body.password;
          var add1= req.body.add1;
          var add2= req.body.add2;
          var city= req.body.city;
          var state= req.body.state; 
          var country= req.body.country;
          var zipcode= req.body.zipcode;
          userDB.findUser(userID, email).exec().then((isExists)=>{
            if(isExists){
              var errorMsg = [{
                "location": "body",
                "msg": "Email ID or Username already exists",
                "param": "email"
              }]
              return res.render('signUp', { session: undefined, errors: errorMsg });
            }
            else{
              var salt = genRandomString(16);
              var passwordData = sha512(password, salt);
              var userObj = new user(userID,fname,lname,email,add1,add2, city, state, zipcode, country,passwordData.passwordHash)
             userDB.addUser(userObj, passwordData.salt).save().then((isInserted)=>{
               res.redirect('/login?user=true');
             })
            }
          })
          
      
      }
      else{
        return res.render('signUp', { errors: null });
      }
    }
  
  });


  /**
  * logout's the user session
  * redirects to login page when request type is GET
  * @function
 */
router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('login');
});


/**
  * checks whether the entered username and password is valid or not.
  * If valid redirects to saved connections page or else displays an error message
  * @function
 */
router.post('/login', urlencodedParser, [
  check('uname').trim().not().isEmpty().withMessage('userName should not be empty').custom((value, { req }) => {

    if (validateEmail(req.body.uname)) {
      check('uname').normalizeEmail()
    }
    else {
      if ((req.body.uname).length <= 4)
        throw new Error('username must be 5 chars long');
    }
    return true;
  }),
  check('psw', 'The password must be 5+ chars long and contain a number').trim()
    .not().isIn(['123', 'password', 'god']).withMessage('Password cannot be a  common word')
    .isLength({ min: 5 })
    .matches(/\d/)], function (req, res) {
      var errors = validationResult(req);
      if (!errors.isEmpty()) {
        var errorsArray = errors.array();
        return res.render('login', { session: undefined, errors: errorsArray });
      }
      var userName = req.body.uname;
      var password = req.body.psw;

      userDB.getUserSalt(userName).exec().then((isPresent)=>{
        if(isPresent){
            var hashedPassword= sha512(password,isPresent.salt);
            {
              userDB.validateUser(userName, hashedPassword.passwordHash).exec().then((userData) => {
                if (userData) {
                  var userDataObject = new user(userData.userID, userData.firstName, userData.lastName, userData.email, userData.address1, userData.address2, userData.city, userData.state, userData.zipCode, userData.country, userData.password);
                  req.session.userSession = userDataObject;
                  res.redirect('savedConnections');
                }
                else {
                  var noUserFound = [{
                    "location": "body",
                    "msg": "Invalid username or password",
                    "param": "psw"
                  }]
                  return res.render('login', { session: undefined, errors: noUserFound });
                }
        
              });
            }
        }
        else{
          var noUserFound = [{
            "location": "body",
            "msg": "Invalid username or password",
            "param": "psw"
          }]
          return res.render('login', { session: undefined, errors: noUserFound });
        }
      }) 
    });

/**
  * gets all the saved connections for the logged In user
  * @function
 */
router.get('/savedConnections', urlencodedParser, function (req, res) {
  if (req.session.userSession != undefined) {
    var activeUserSession = req.session.userSession;
    var savedConnectionsList = [];
    userProfileDB.getUserProfile(activeUserSession.userID).exec().then((data) => {
      if (data) {
        savedConnectionsList = data.userConnectionList;
        req.session.currentProfile = savedConnectionsList;
      }
      res.render('savedConnections', { userConnectionsList: savedConnectionsList, session: activeUserSession });

    }).catch((err) => { console.log(err); });
  }
  else {
    res.redirect('/login')
  }
});

/**
  * updates the connection response, delete the saved connection for an user and adds the connection
  * @function
 */
router.post('/savedConnections', urlencodedParser, function (req, res) {
  var activeUserSession = req.session.userSession;
  var action = req.query.action;
  var connid = req.query.id;
  var connectionResponse = req.body.response;
  var rsvpItem = req.body.rsvp;

  if (activeUserSession) {
    if (rsvpItem != undefined && rsvpItem == 'rsvp') {
      if (!action && !connid) {
        res.redirect('savedConnections');
      } else {
        if(/^\d+$/.test(connid)){
          if (action == 'save') {
            connectionDB.getConnection(connid).exec().then((conItem) => {
             if(conItem) {
              userProfileDB.updateRSVP(activeUserSession.userID, connid, connectionResponse).exec().then((updated) => {
                if (updated.n == 0) {
                  userProfileDB.addRSVP(activeUserSession.userID, connid, conItem.connectionName, conItem.topic, connectionResponse).exec().then((addditem) => {
                    return res.redirect('/savedConnections');
                  }).catch((err) => { console.log(err); })
                } else {
                  return res.redirect('/savedConnections');
                }
              }).catch((err) => { console.log(err); });
              }
              else{
                  return res.redirect('connections')
              }
             
            });
          }
          else if (action == 'delete') {
            userProfileDB.deleteRSVP(activeUserSession.userID, connid).exec().then((item) => {
              return res.redirect('/savedConnections');
            }).catch((err) => { console.log(err); })
          }
        }
        else{
          return res.redirect('connections');
        }
       
      }
    } else {
      res.redirect('connections');
    }
  }
  else {
    res.redirect('login');
  }

});

/**
  * error page for malfunctioned url endpoint
  * @function
 */
router.get('/*', function (request, response) {
  response.render('404', { session: request.session.userSession });
});

module.exports = router;
