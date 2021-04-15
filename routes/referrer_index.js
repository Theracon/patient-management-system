var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    middleware = require("../middleware");

// SHOW(GET): ACCOUNT PENDING ACTIVATION/REFERRERS
router.get("/referrers/:username/pending", middleware.isUserLoggedIn, function(req, res) {
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                if (user.role === 0) {
                    return res.render("referrers/pending");
                }
                return res.redirect("/referrers/" + user.username + "/dashboard");
            }
            req.flash("error", "Please login or create an account.");
            res.redirect("/login");
            return;
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// SHOW(GET): DASHBOARD/REFERRERS
router.get('/referrers/:username/dashboard', middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                return res.render("referrers/dashboard");
            }
            req.flash("error", "Please login or create an account.");
            res.redirect("/login");
            return;
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// SHOW(GET): ACCOUNT SUSPENDED/REFERRERS
router.get("/referrers/:username/suspended", middleware.isUserLoggedIn, function(req, res) {
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                if (user.role === 1) {
                    return res.redirect("/referrers/" + user.username + "/dashboard");
                }
                return res.render("referrers/suspended");
            }
            req.flash("error", "Please login or create an account.");
            res.redirect("/login");
            return;
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

module.exports = router;