var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// REPORT SCHEMA
var ReportSchema = new mongoose.Schema({
    id: String,
    booking_id: String,
    department_id: String,
    department_name: String,
    investigation: String,
    body: String,
    reported_by: String,
    reported_on: String
});

// BOOKING SCHEMA
var BookingSchema = new mongoose.Schema({
    id: String,
    date: String,
    doctor: String,
    patient: String,
    status: Number,
    performed_on: String,
    performed_by: String,
    data: [{ department_id: String, investigations: String }],
    reports: [ReportSchema]
});

// PATIENTS SCHEMA
var PatientSchema = new mongoose.Schema({
    date_registered: String,
    accession_number: String,
    firstname: String,
    middlename: String,
    lastname: String,
    age: String,
    sex: String,
    phone: String,
    bookings: [BookingSchema]
});

module.exports = mongoose.model("Patient", PatientSchema);