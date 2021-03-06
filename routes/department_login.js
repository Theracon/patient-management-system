var express = require("express"),
    passport = require("passport"),
    router = express.Router(),
    User = require("../models/user");


// INDEX(GET): DEPARTMENT LOGIN PAGE
router.get("/accounts/departments/login", function(req, res) {
    return res.render("departments/login");
});

// LOGIN(POST): DEPARTMENT login
router.post("/accounts/departments/login", function(req, res) {
    // Check if username exists in the database
    User.findOne({ typeOfUser: "department", username: req.body.username }, function(err, user) {
        if (!err) {
            if (user) {
                // Check if entered password matches password in the database
                user.comparePassword(req.body.password, function(err, isMatch) {
                    if (err) throw err;
                    if (isMatch) {
                        passport.authenticate("local")(req, res, function() {
                            return res.redirect('/departments/' + req.user.username + "/dashboard");
                        });
                    } else {
                        req.flash("error", "Incorrect password. Try again.");
                        return res.redirect("back");
                    }
                });
                return;
            }
            req.flash("error", "Incorrect username. Try again.")
            return res.redirect("back");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

module.exports = router;