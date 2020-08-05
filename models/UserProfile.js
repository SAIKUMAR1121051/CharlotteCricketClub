var UserConnection = require('./userConnection.js');
var connectionDB = require('../utilities/connectionDB.js');
var Connection = require('./connection.js');

var userID, userConnectionList;
module.exports = class UserProfile {

  constructor(userID, userConnectionList) {
    this.userID = userID;
    this.userConnectionList = userConnectionList;
  }

  
get getUserID(){
  return this.userID;
}

set setUserID(value){
this.userID=value;
}
  

 get getUserConnectionList() {
    return this.userConnectionList;
  }
 set setUserConnectonList(connectionList) {
    this.userConnectionList = connectionList;
  }

}
