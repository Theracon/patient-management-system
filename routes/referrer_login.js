var express = require("express"),
    passport = require("passport"),
    router = express.Router(),
    User = require("../models/user");

// LOGIN(POST): REFERRER LOGIN LOGIC/REFERRERS
router.post("/referrers/login", function(req, res) {
    // Check if username exists in the database
    User.findOne({ typeOfUser: "referrer", username: req.body.username }, function(err, user) {
        if (!err) {
            if (user) {
                // Check if entered password matches password in the database
                user.comparePassword(req.body.password, function(err, isMatch) {
                    if (err) throw err;
                    if (isMatch) {
                        passport.authenticate("local")(req, res, function() {
                            return res.redirect('/referrers/' + req.user.username + "/dashboard");
                        });
                    } else {
                        req.flash("error", "Wrong password. Try again.");
                        return res.redirect("back");
                    }
                });
                return;
            }
            req.flash("error", "Wrong username. Try again.")
            return res.redirect("/login");
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

module.exports = router;