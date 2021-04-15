var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    middleware = require("../middleware");

// SHOW(GET): HOSPITAL DASHBOARD/HOSPITALS
router.get("/hospitals/:username/dashboard", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                if (user.role === 1) {
                    return res.render("hospitals/dashboard");
                } else {
                    return res.redirect("/hospitals/" + user.username + "/pending");
                }
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// SHOW(GET): ACTIVATION PENDING/HOSPITALS
router.get("/hospitals/:username/pending", middleware.isUserLoggedIn, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                if (user.role === 1) {
                    return res.redirect("/hospitals/" + user.username + "/dashboard");
                } else {
                    return res.render("hospitals/pending");
                }
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// SHOW(GET): ACCOUNT SUSPENDED/HOSPITALS
router.get("/hospitals/:username/suspended", middleware.isUserLoggedIn, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                if (user.role === 1) {
                    return res.redirect("/hospitals/" + user.username + "/dashboard");
                }
                return res.render("hospitals/suspended");
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