var express = require("express"),
    router = express.Router(),
    User = require("../models/user");

// SHOW(GET): ALL DOCTORS
router.get("/admin/doctors", function(req, res) {
    // Fetch all doctors
    User.find({ typeOfUser: "doctor" }, function(err, doctors) {
        return res.render("admin/doctors", { doctors });
    });
});

// SHOW(GET): DOCTOR INFO
router.get("/admin/doctors/:username", function(req, res) {
    User.findOne({ typeOfUser: "doctor", username: req.params.username }, function(err, doctor) {
        if (err) {
            req.flash("error", "Oops! Something isn't quite right.");
            return res.redirect("back");
        }

        return res.render("admin/doctorInfo", { doctor });
    });
});

// REMOVE(DELETE): REMOVE A DOCTOR
router.delete("/admin/doctors/:id", function(req, res) {
    User.findById(req.params.id, function(err, department) {
        if (err) {
            req.flash("error", "Oops! Something isn't quite right.");
            return res.redirect("back");
        }
        if (department) {
            User.findByIdAndRemove(req.params.id, function(err) {
                if (err) {
                    req.flash("error", "Oops! Something isn't quite right.");
                    return res.redirect("back");
                }

                return res.redirect("/admin/departments-clinics-and-units");
            });
            return;
        }
        req.flash("error", "Oops! Something isn't quite right.");
        return res.redirect("back");
    });
});

module.exports = router;