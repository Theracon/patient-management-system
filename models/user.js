var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

// DEPARTMENT SCHEMA
var DepartmentSchema = new mongoose.Schema({
    name: String,
    staff_count: Number,
    units: Array,
});

// PATIENT SCHEMA
var PatientSchema = new mongoose.Schema({
    name: String,
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
var UserSchema = new mongoose.Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    typeOfUser: String,
    role: Number,
    signup_time: String,
    signup_date: String,
    signup_month: String,
    signup_year: String,
    referrerDetails: referrerDetailSchema,
    hospitalDetails: hospitalDetailSchema,
});

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);