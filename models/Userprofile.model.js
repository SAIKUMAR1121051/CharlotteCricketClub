var mongoose = require('mongoose');

var userConn = new mongoose.Schema({
    connectionID: {
        type: Number,
        required: true
    },
    connectionName:{
        type: String,
        required: true
    },

    connectionTopic:{
        type: String,
        required: true
    },

    rsvp: {
        type: String,
        required: true
    }
});

var userProfileSchema = new mongoose.Schema({
    userID: {type:String, required: true},
    userConnectionList: [userConn]
});


module.exports = mongoose.model('Userprofile', userProfileSchema);