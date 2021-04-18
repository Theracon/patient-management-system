var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    Patient = require("../models/patient"),
    hospitalCount = '',
    referrerCount = '',
    patientCount = '',
    middleware = require("../middleware");

// SHOW(GET): FORM TO DEACTIVATE REFERRER/REFERRERS
router.get("/referrers/:username/deactivate", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
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
                            return res.render("referrers/deactivate", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
                        });
                    });
                });
                return;
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// DELETE(DELETE): DEACTIVATE REFERRER/REFERRERS + ADMIN
router.delete("/referrers/:id", middleware.isUserLoggedIn, function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash("error", "Oops! Something isn't quite right.")
            return res.redirect("back");
        }
        return res.redirect("/");
    });
});

module.exports = router;