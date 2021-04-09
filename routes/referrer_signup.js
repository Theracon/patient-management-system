var date = new Date(),
    express = require("express"),
    functions = require("../functions"),
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    passport = require("passport"),
    router = express.Router(),
    User = require("../models/user");

// CREATE(POST): ADD A NEW REFERRER TO DATABASE/ALL
router.post('/referrers/register', function(req, res) {
    // Check if username exists in the database
    User.findOne({ typeOfUser: "referrer", username: req.body.username }, function(err, user) {
        if (!err) {
            if (user) {
                req.flash("error", "Sorry, that username is taken.");
                return res.redirect("back");
            }
            var referrer = new User({
                typeOfUser: "referrer",
                username: req.body.username,
                password: req.body.password,
                hospitalDetails: null,
                signup_time: functions.formatTime(date),
                signup_date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                signup_month: months[date.getMonth()],
                signup_year: date.getFullYear(),
            });
            User.register(referrer, referrer.password, function(err, user) {
                if (!err) {
                    referrer.save(function(err, referrer) {
                        passport.authenticate("local")(req, res, function() {
                            req.flash("success", "Hi, welcome to Fastclinic!");
                            return res.redirect('/referrers/' + req.user.username + "/update");
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