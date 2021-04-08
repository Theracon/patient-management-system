var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    middleware = require("../middleware");

// SHOW(GET): FORM TO DEACTIVATE REFERRER/REFERRERS
router.get("/referrers/:username/deactivate", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                return res.render("referrers/deactivate");
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// DELETE(DELETE): DEACTIVATE REFERRER/REFERRERS + ADMIN
router.delete("/referrers/:id", middleware.isUserLoggedIn, function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash("error", "Oops! An error occurred.");
            return res.redirect("back");
        }
        return res.redirect("/");
    });
});

module.exports = router;