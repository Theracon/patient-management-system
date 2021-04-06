var mongoose  = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

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

module.exports = mongoose.model("Patient")