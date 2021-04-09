var date = new Date(),
    express = require("express"),
    functions = require("../functions"),
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    passport = require("passport"),
    router = express.Router(),
    User = require("../models/user");

// CREATE(POST): ADD A NEW HOSPITAL TO DATABASE/ALL
router.post('/hospitals/register', function(req, res) {
    // Check if username exists in the database
    User.findOne({ typeOfUser: "hospital", username: req.body.username }, function(err, user) {
        if (!err) {
            if (user) {
                req.flash("error", "Sorry, that username is taken.");
                return res.redirect("back");
            }
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
                            req.flash("success", "Hi, welcome to Fastclinic!");
                            return res.redirect('/hospitals/' + req.user.username + "/details");
                        });
                    });
                    return;
                }
                req.flash("error", "Oops! An error occurred.");
                return res.redirect("back");
            });
            return;
        }
        req.flash("error", "Oops! An error occurred.");
        return res.redirect("back");
    });
});

module.exports = router;