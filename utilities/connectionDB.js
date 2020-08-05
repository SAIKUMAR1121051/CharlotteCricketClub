var connectionDataModel = require('./../models/connection');
var Connection = require('../models/Connection.model');

/**
 * returns the query to get the connection details matches with connection ID.
 * @function
 * @param {string} connectionID - List of required fields.
 */
var getConnection=function(connectionID){
 return Connection.findOne({connectionID:connectionID});
 
};

/**
 * returns the query to get the connection details.
 * @function
 */
var getConnections = function(){
  return Connection.find({});
};

/**
 * returns the query to get the Last connection details.
 * @function
 */
var getLastConnectionID = function(){
  return Connection.find({},{connectionID:1,_id:0}).sort({connectionID: -1}).limit(1);
}

/**
 * returns the query to get the topics from all connection details.
 * @function
 */
var addCategories = function(){
     return Connection.find({},{topic:1,_id:0}) ;   
};


/**
 * returns the query to check whether the entered connection name and topic is present in a connection or not.
 * @function
 * @param {string} conName - List of required fields.
 * @param {string} conTopic - List of required fields.
 */
var validateConnection= function(conName,conTopic){
  return Connection.findOne({ connectionName: conName, topic: conTopic});
}


module.exports.getConnections = getConnections;
module.exports.getConnection = getConnection;
module.exports.addCategories = addCategories;
module.exports.getLastConnectionID = getLastConnectionID;
module.exports.validateConnection = validateConnection;
