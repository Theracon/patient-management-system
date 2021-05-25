var date = new Date(),
    express = require("express"),
    functions = require("../functions"),
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    passport = require("passport"),
    router = express.Router(),
    User = require("../models/user"),
    Patient = require("../models/patient"),
    hospitalCount = '',
    referrerCount = '',
    patientCount = '';

// INDEX(GET): SIGN UP PAGE/ALL
router.get("/accounts/hospitals/register", function(req, res) {
    // Fetch all hospitals
    User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
        // Fetch all referrers
        User.find({ typeOfUser: "referrer" }, function(err, referrers) {
            // Fetch all patients
            Patient.find({}, function(err, patients) {
                // Update counts
                hospitalCount = hospitals.length;
                referrerCount = referrers.length;
                patientCount = patients.length;
                return res.render("hospitals/register", { hospitalCount, referrerCount, patientCount });
            });
        });
    });
});

// CREATE(POST): ADD A NEW HOSPITAL TO DATABASE/ALL
router.post('/accounts/hospitals/register', function(req, res) {
    // Check if username exists in the database
    User.findOne({ typeOfUser: "hospital", username: req.body.username }, function(err, user) {
        if (!err) {
            if (user) {
                req.flash("error", "Sorry, that username is taken.");
                return res.redirect("back");
            }

            date = new Date();

            var hospital = new User({
                typeOfUser: "hospital",
                username: req.body.username,
                password: req.body.password,
                referrerDetails: null,
                signup_time: functions.formatTime(date),
                signup_date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                signup_month: months[date.getMonth()],
                signup_year: date.getFullYear(),
            });
            User.register(hospital, hospital.password, function(err, user) {
                if (!err) {
                    hospital.save(function(err, hospital) {
                        passport.authenticate("local")(req, res, function() {
                            req.flash("success", "Hello there! Welcome to Fastclinic.");
                            return res.redirect('/hospitals/' + req.user.username + "/details");
                        });
                    });
                    return;
                }
                req.flash("error", "Oops! Something isn't quite right.")
                return res.redirect("back");
            });
            return;
        }
        req.flash("error", "Oops! Something isn't quite right.")
        return res.redirect("back");
    });
});

module.exports = router;