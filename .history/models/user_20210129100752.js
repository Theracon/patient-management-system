var mongoose  = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// DEPARTMENT SCHEMA
var DepartmentSchema = new mongoose.Schema({
    name: String,
    procedures: Array
});

// PATIENT SCHEMA
var PatientSchema = new mongoose.Schema({
    name: String,
    investigation: String,
    phone: String,
    hospital: String,
    hospital_address: String,
    accession_number: String,
    status: String,
    referrer: String,
    referrer_id: String,
    amount_paid: Number,
    referrer_commission: Number,
    referral_month: String,
    referral_date: String,
    referral_time: String,
    authentication_month: String,
    authentication_date: String,
    authentication_time: String,
});

// MESSAGE REPLY SCHEMA
var MessageReplySchema = new mongoose.Schema({
    author_id: String,
    author_name: String,
    content: String,
    typeOfSender: String,
    date: String,
    month: String,
    replying_to: String,
});

// MESSAGE SCHEMA
var MessageSchema = new mongoose.Schema({
    typeOfSender: String,
    author_id: String,
    author_name: String,
    content: String,
    time: String,
    month: String,
    date: String,
    replies: [MessageReplySchema],
    number_of_replies: Number,
});

// REFERRER DETAILS SCHEMA
var referrerDetailSchema = new mongoose.Schema({
    title: String,
    firstname: String,
    lastname: String,
    name: String,
    institution: String,
    address: String, 
    phone: String,
    bank: String,
    ac_number: String,
    ac_name: String,
    patient_count: Number,
    commission: Number,
    patients: [PatientSchema],
    messages: [MessageSchema],
    last_updated: String,
    update_count: Number,
});

// HOSPITAL DETAILS SCHEMA
var hospitalDetailSchema = new mongoose.Schema({
    typeOfInstitution: String,
    name: String,
    address: String,
    email: String,
    phone: String,
    website: String,
    cmd: String,
    ceo: String,
    consultants: Number,
    doctors: Number,
    departments: [DepartmentSchema],
    patients: [PatientSchema],
    messages: [MessageSchema],
});

// ADMIN SCHEMA
var AdminSchema = new mongoose.Schema({
    
});

// USER SCHEMA
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    typeOfUser: String,
    role: Number,
    signup_time: String,
    signup_date: String,
    signup_month: String,
    signup_year: String,
    referrerDetails: referrerDetailSchema,
    hospitalDetails: hospitalDetailSchema,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);