var mongoose = require('mongoose');

var connectionSchema = new mongoose.Schema({
connectionID: {type:String, required:true},
connectionName: {type:String, required:true},
topic: {type:String, required:true},
venue: {type:String, required:true},
details: {type:String, required:true},
dateandTime: {type:String, required:true},
userID: {type:String, required:true}
});

module.exports = mongoose.model('Connection', connectionSchema);


