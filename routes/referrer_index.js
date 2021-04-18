var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    Patient = require("../models/patient"),
    hospitalCount = '',
    referrerCount = '',
    patientCount = '',
    middleware = require("../middleware");

// SHOW(GET): ACCOUNT PENDING ACTIVATION/REFERRERS
router.get("/referrers/:username/pending", middleware.isUserLoggedIn, function(req, res) {
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                if (user.role === 0) {
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
                                return res.render("referrers/pending", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
                            });
                        });
                    });
                    return;
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
                            return res.render("referrers/dashboard", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
                        });
                    });
                });
                return;
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
                            return res.render("referrers/suspended", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
                        });
                    });
                });
                return;
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