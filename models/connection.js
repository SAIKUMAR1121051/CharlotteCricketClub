var connectionID, connectionName, connectionTopic, details, dateandTime, venue;

 module.exports = class Connection{
    constructor(connectionID,connectionName,connectionTopic,details,dateandTime,venue){
        this.connectionID = connectionID;
        this.connectionName = connectionName;
        this.connectionTopic = connectionTopic;
        this.details = details;
        this.dateandTime = dateandTime;
        this.venue = venue;
    }

get getConnectionID(){
    return this.connectionID;
}

set setConnectionID(value){
    this.connectionID = value;
}

get getConnectionName(){
    return this.connectionName;
}

set setConnectionName(value){
    this.connectionName = value;
}

get getConnectionTopic(){
    return this.connectionTopic;
}

set setConnectionTopic(value){
    this.connectionTopic = value;
}

get getDetails(){
    return this.details;
}

set setDetails(value){
    this.details = value;
}

get getDateandTime(){
    return this.dateandTime;
}

set setDateandTime(value){
    this.dateandTime = value;
}

get getvenue(){
    return this.venue;
}

set setvenue(value){
    this.venue = value;
}

}
