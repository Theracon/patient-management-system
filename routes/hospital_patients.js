var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    Patient = require("../models/patient"),
    middleware = require("../middleware");

// SHOW(GET): ALL PATIENTS/HOSPITALS
router.get("/hospitals/:username/patients", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                // Extract hospital's patients array and save it to a variable
                var patients = user.hospitalDetails.patients;
                // Render patients template, pass in hospital's patients array
                return res.render("hospitals/patients", { patients: patients });
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// SHOW: A PATIENT'S DETAILS/HOSPITALS
router.get("/hospitals/:username/patients/:accession_number", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                Patient.findOne({ accession_number: req.params.accession_number }, function(err, patient) {
                    return res.render("hospitals/patientDetails", { patient: patient, user: user });
                });
                return;
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

module.exports = router;