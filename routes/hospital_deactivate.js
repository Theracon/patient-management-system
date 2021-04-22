var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    Patient = require("../models/patient"),
    hospitalCount = '',
    referrerCount = '',
    patientCount = '',
    middleware = require("../middleware");

// UPDATE(PUT): TEMPORARILY DISABLE ACCOUNT/HOSPITALS
router.put("/hospitals/:username/disable", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (err) {
            req.flash("error", "Oops! Something isn't quite right.");
            res.redirect("back");
        }
        if (user) {
            user.role = 0.75;
            user.account_disabled = true;
            user.save(function(err, user) {
                if (err) {
                    req.flash("error", "Oops! Something isn't quite right.");
                    res.redirect("back");
                }
                return res.redirect("/hospitals/" + user.username + "/dashboard");
            });
        }
    });
});

// UPDATE(PUT): REACTIVATE TEMPORARILY DISABLED ACCOUNT/REFERRER
router.put("/hospitals/:username/reactivate", middleware.isUserLoggedIn, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (err) {
            req.flash("error", "Oops! Something isn't quite right.");
            res.redirect("back");
        }
        if (user) {
            user.role = 1;
            user.account_disabled = false;
            user.save(function(err, user) {
                if (err) {
                    req.flash("error", "Oops! Something isn't quite right.");
                    res.redirect("back");
                }
                return res.redirect("/hospitals/" + user.username + "/dashboard");
            });
        }
    });
});

// SHOW(GET): FORM TO DEACTIVATE HOSPITAL/HOSPITALS
router.get("/hospitals/:username/deactivate", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
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
                            return res.render("hospitals/deactivate", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
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

// REMOVE(DELETE): DEACTIVATE HOSPITAL/HOSPITALS + ADMIN
router.delete("/hospitals/:id", middleware.isUserLoggedIn, function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash("error", "Oops! Something isn't quite right.")
            return res.redirect("back");
        }
        return res.redirect("/hospitals/register");
    });
});

module.exports = router;