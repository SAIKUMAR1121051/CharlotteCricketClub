var Connection = require('../models/Connection.model');
var Userprofile = require('../models/Userprofile.model');


/**
 * returns the query to get the user connections of a user by using the userID.
 * @function
 * @param {string} userID - List of required fields.
 */
var getUserProfile = function(userID){
   return Userprofile.findOne({ userID:userID },{userConnectionList:1,_id:0});
 }

/**
 * returns the query to add the rsvp for a connection.
 * @function
 * @param {string} userID - List of required fields.
 * @param {string} connID - List of required fields.
 * @param {string} connName - List of required fields.
 * @param {string} connTopic - List of required fields.
 * @param {string} rsvpRes - List of required fields.
 */
var addRSVP = function(userID,connID, connName, connTopic, rsvpRes){
    return  Userprofile.updateOne({ "userID": userID,"userConnectionList.connectionID" : {$ne: connID}},
       { $push: { userConnectionList: {"connectionID": connID, "connectionName":connName, "connectionTopic":connTopic, "rsvp": rsvpRes }}});
   };

/**
 * returns the query to update the rsvp for a connection.
 * @function
 * @param {string} userID - List of required fields.
 * @param {string} connectionID - List of required fields.
 * @param {string} rsvp - List of required fields.
 */
var updateRSVP = function(userID, connectionID, rsvp){
    return Userprofile.updateOne({userID : userID,"userConnectionList.connectionID": connectionID},
         {$set: {"userConnectionList.$.rsvp": rsvp}});
    };

  
/**
 * returns the query to delete the rsvp for a connection.
 * @function
 * @param {string} userID - List of required fields.
 * @param {string} connectionID - List of required fields.
 */
 var deleteRSVP = function(userID,connectionID){
        return Userprofile.updateOne({userID : userID},
            { $pull: {userConnectionList: {connectionID:connectionID}}});
      };


/**
 * returns the query to save the connection in the user profile and also updates the the rsvp for a connection as yes.
 * @function
 * @param {object} connectionObject - List of required fields.
 * @param {string} userID - List of required fields.
 */
var addConnection = function(connectionObject, userID){

  return Connection.findOneAndUpdate(
      {connectionName:connectionObject.connectionName,topic:connectionObject.connectionTopic},
      {connectionID:connectionObject.connectionID, 
         connectionName:connectionObject.connectionName, 
         topic:connectionObject.connectionTopic,
         details:connectionObject.details,
         dateandTime:connectionObject.dateandTime,
         venue:connectionObject.venue,
         userID:userID },
      {upsert: true, new: true, runValidators: true}).exec().then((result)=>{
         return Userprofile.findOne({userID:userID}).exec().then((result)=>{
            if(result){
              return Userprofile.updateOne({ "userID": userID,"userConnectionList.connectionID" : {$ne: connectionObject.connectionID}},
               { $push: { userConnectionList: {"connectionID": connectionObject.connectionID, "connectionName":connectionObject.connectionName, "connectionTopic":connectionObject.connectionTopic, "rsvp": "yes" }}}).exec().then((responRes)=>{
                   return responRes;
               });
            }
            else{

           return Userprofile.findOneAndUpdate({"userID":userID}, {
               "userID": userID,
               "userConnectionList" : [{connectionID:connectionObject.connectionID , connectionName:connectionObject.connectionName, connectionTopic:connectionObject.connectionTopic, rsvp:'yes'}]
            }, {upsert: true, new: true, runValidators: true}).exec().then((data)=>{
               return data;
            })
            }
         })
      });       
      };
      
        
      module.exports.getUserProfile = getUserProfile;
      module.exports.addRSVP = addRSVP;
      module.exports.updateRSVP = updateRSVP;
      module.exports.addConnection = addConnection;
      module.exports.deleteRSVP = deleteRSVP;