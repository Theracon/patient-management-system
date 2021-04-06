var mongoose  = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// ADMIN SCHEMA
var Admin = new mongoose.Schema({
    username: String,
    password: String,
    type
});