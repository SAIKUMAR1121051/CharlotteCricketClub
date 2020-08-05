var userDataModel = require('./../models/User');
var user = require('./../models/UserSchema');


/**
 * returns the query to get the user details by using the userID.
 * @function
 * @param {string} userID - List of required fields.
 */
var getUser=function(userID){
    return user.findOne({userID:userID});
  };


/**
 * returns the query to validate the user details by using the userID and password.
 * @function
 * @param {string} userName - List of required fields.
 * @param {string} password - List of required fields.
 */
var validateUser= function(userName, password){
    return user.findOne({$and:[{$or: [{userID:userName}, {email:userName}]}, {password:password}]}
      )
};

/**
 * returns the query to find the user details by using the userID and email.
 * @function
 * @param {string} userName - List of required fields.
 * @param {string} email - List of required fields.
 */
var findUser= function(userID, email){
  return user.findOne({userID:userID}, {email:email})
};

/**
 * returns the query to add a new user to the database.
 * @function
 * @param {object} userObj - List of required fields.
 * @param {string} salt - List of required fields.
 */
var addUser = function(userObj,salt){
  return new user({userID:userObj.userID,
    firstName:userObj.firstName,
    lastName:userObj.lastName,
    email:userObj.email,
    address1:userObj.address1,
    address2:userObj.address2,
    city:userObj.city,
    state:userObj.state,
    zipCode:userObj.zipCode,
    country:userObj.country,
    password:userObj.password,
    salt:salt})
  };

/**
 * returns the query to get the salt field for a user from the database.
 * @function
 * @param {string} userID - List of required fields.
 */
var getUserSalt=function(userID){
    return user.findOne({$or:[{userID:userID}, {email:userID}]},{_id:0,salt:1});
}

module.exports.getUser = getUser;
module.exports.validateUser = validateUser;
module.exports.findUser = findUser;
module.exports.addUser = addUser;
module.exports.getUserSalt = getUserSalt;


