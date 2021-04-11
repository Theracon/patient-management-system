var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// DEPARTMENT SCHEMA
var DepartmentSchema = new mongoose.Schema({
    name: String,
    staff_count: Number,
    units: Array,
});

// PATIENT SCHEMA
var PatientSchema = new mongoose.Schema({
    name: String,
    department: String,
    investigation: String,
    phone: String,
    hospital_name: String,
    hospital_address: String,
    hospital_id: String,
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

// MESSAGE SCHEMA
var NotificationSchema = new mongoose.Schema({
    date: String,
    time: String,
    content: String,
    status: String,
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
    notifications: [NotificationSchema],
    unread_notifications_count: Number,
    last_updated: String,
    update_count: Number,
});

// HOSPITAL DETAILS SCHEMA
var hospitalDetailSchema = new mongoose.Schema({
    institution_type: String,
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
    procedures: Array,
    patients: [PatientSchema],
    notifications: [NotificationSchema],
    unread_notifications_count: Number,
    last_updated: String,
    update_count: Number,
});

// USER SCHEMA
var RemovedUserSchema = new mongoose.Schema({
    username: String,
    password: String,
    typeOfUser: String,
    role: Number,
    removal_date: String,
    removal_year: String,
    removal_month: String,
    removal_time: String,
    referrerDetails: referrerDetailSchema,
    hospitalDetails: hospitalDetailSchema,
});

RemovedUserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("RemovedUser", RemovedUserSchema);