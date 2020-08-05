
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    userID: {type:String, required:true},
    firstName: {type:String, required:true},
    lastName: {type:String, required:true},
    email: {type:String, required:true},
    address1: {type:String, required:true},
    address2: {type:String},
    city: {type:String, required:true},
    state: {type:String, required:true},
    zipCode: {type:String, required:true},
    country: {type:String, required:true},
    password:{type:String, required:true},
    salt:{type:String, required:true}
});

module.exports = mongoose.model('user', userSchema);









