var express = require("express"),
    router = express.Router(),
    uniqid = require("uniqid"),
    User = require("../models/user"),
    Patient = require("../models/patient");

// Render form to register a new patient
router.get("/admin/patients/new", function(req, res) {
    return res.render("admin/newPatient");
});

// Logic to register a new patient
router.post("/admin/patients", function(req, res) {
    // Globals variables
    var id = uniqid.time("", Math.floor(Math.random() * 100)).toUpperCase();
    var date = new Date();

    // Create and save a new Patient object
    var patient = new Patient({
        date_registered: date.toLocaleString("en-NG"),
        accession_number: id,
        firstname: req.body.firstname,
        middlename: req.body.middlename,
        lastname: req.body.lastname,
        age: req.body.age,
        sex: req.body.sex,
        phone: req.body.phone,
        bookings: [],
        reports: []
    });

    patient.save(function(err, patient) {
        if (err) {
            console.log(err);
            req.flash("error", "Oops! Something isn't quite right.")
            return res.redirect("back");
        }

        // Redirect to patients page
        res.redirect("/admin/patients");
    });
});

// Show all patients
router.get("/admin/patients", function(req, res) {
    Patient.find({}, function(err, patients) {
        if (err) {
            console.log(err);
            req.flash("error", "Oops! Something isn't quite right.")
            return res.redirect("back");
        }

        res.render("admin/patients", { patients });
    });
});

// Show a patient's info
router.get("/admin/patients/:accession_number", function(req, res) {
    Patient.findOne({ accession_number: req.params.accession_number }, function(err, patient) {
        if (err) {
            console.log(err);
            req.flash("error", "Oops! Something isn't quite right.")
            return res.redirect("back");
        }

        res.render("admin/patientInfo", { patient });
    });
});

module.exports = router;