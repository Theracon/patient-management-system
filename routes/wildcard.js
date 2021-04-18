var express = require("express"),
    User = require("../models/user"),
    Patient = require("../models/patient"),
    hospitalCount = '',
    referrerCount = '',
    patientCount = '',
    router = express.Router();

// SHOW(GET): 404 PAGE/ALL
router.get("/*", function(req, res) {
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
                return res.render("index/no-page", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
            });
        });
    });
    return;
});

module.exports = router;