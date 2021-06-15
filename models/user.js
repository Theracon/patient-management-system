// DEPENDENCIES
var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose"),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

// NOTIFICATION SCHEMA
var NotificationSchema = new mongoose.Schema({
    date: String,
    content: String,
    status: String,
});

// PROCEDURE SCHEMA
var InvestigationSchema = new mongoose.Schema({
    name: String,
    price: Number
});

// REPORT SCHEMA
var ReportSchema = new mongoose.Schema({
    investigation_name: String,
    investigation_date: String,
    body: String,
    department: String,
    reported_by: String
});

// PATIENTS SCHEMA
var PatientSchema = new mongoose.Schema({
    accession_number: String,
    firstname: String,
    middlename: String,
    lastname: String,
    age: String,
    sex: String,
    contact: String,
    department: Array,
    status: String,
    authentication_date: String,
    total_amount_paid: String,
    investigations: [InvestigationSchema],
    reports: [ReportSchema]
});

// DEPARTMENTS SCHEMA
var DepartmentSchema = new mongoose.Schema({
    name: String,
    hod: String,
    investigations: [InvestigationSchema],
    patients: [PatientSchema]
});

// DOCTOR SCHEMA
var DoctorSchema = new mongoose.Schema({
    firstname: String,
    middlename: String,
    lastname: String,
    department: String,
    patients: [PatientSchema]
});

// USER SCHEMA
var UserSchema = new mongoose.Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    typeOfUser: String,
    role: Number,
    account_disabled: Boolean,
    signup_date: String,
    notifications: [NotificationSchema],
    unread_notifications_count: Number,
    last_updated: String,
    department_details: DepartmentSchema,
    doctor_details: DoctorSchema
});

// ENCRYPT PASSWORD ON USER SIGNUP
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

// COMPARE PASSWORDS ON USER LOGIN
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// PLUG IN USER SCHEMA
UserSchema.plugin(passportLocalMongoose);

// EXPORT USER SCHEMA
module.exports = mongoose.model("User", UserSchema);