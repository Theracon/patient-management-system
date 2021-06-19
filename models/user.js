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
    number_price: String,
    price: String
});

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

// DEPARTMENTS SCHEMA
var DepartmentSchema = new mongoose.Schema({
    name: String,
    hod: String,
    investigations: [InvestigationSchema],
    bookings: [BookingSchema],
    reports: [ReportSchema]
});

// DOCTOR SCHEMA
var DoctorSchema = new mongoose.Schema({
    firstname: String,
    middlename: String,
    lastname: String,
    department: String,
    department_id: String,
    bookings: [BookingSchema]
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
    ROLE: Number,
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