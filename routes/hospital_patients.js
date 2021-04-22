var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    Patient = require("../models/patient"),
    hospitalCount = '',
    referrerCount = '',
    patientCount = '',
    middleware = require("../middleware");

// SHOW(GET): ALL PATIENTS/HOSPITALS
router.get("/hospitals/:username/patients", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                var patients = user.hospitalDetails.patients;

                // Fetch all hospitals
                User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
                    hospitalCount = hospitals.length;
                    // Fetch all referrers
                    User.find({ typeOfUser: "referrer" }, function(err, referrers) {
                        referrerCount = referrers.length;
                        Patient.find({}, function(err, allPatients) {
                            patientCount = allPatients.length;
                            return res.render("hospitals/patients", { patients, hospitalCount, referrerCount, patientCount });
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

// SHOW(GET): A PATIENT'S DETAILS/HOSPITALS
router.get("/hospitals/:username/patients/:accession_number", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                // Find patient
                Patient.findOne({ accession_number: req.params.accession_number }, function(err, patient) {
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
                                return res.render("hospitals/patientDetails", { patient: patient, hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
                            });
                        });
                    });
                    return;
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

module.exports = router;