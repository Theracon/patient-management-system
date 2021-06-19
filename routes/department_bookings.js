var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    Patient = require("../models/patient");

// SHOW(GET): SHOW ALL BOOKINGS
router.get("/departments/:username/bookings", function(req, res) {
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, user) {
        if (err) {
            console.log(err);
            req.flash("error", "Oops! Something isn't quite right.");
            return res.redirect("back");
        }

        res.render("departments/bookings", { user });
    });
});

// FORM TO AUTHENTICATE A BOOKING
router.get("/departments/:username/bookings/:id/authenticate", function(req, res) {
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, user) {
        if (err) {
            console.log(err);
            req.flash("error", "Oops! Something isn't quite right.");
            return res.redirect("back");
        }

        return res.render("departments/authenticate", { user, bookingId: req.params.id });
    });
});

// UPDATE(PUT): AUTHENTICATE A BOOKING
router.put("/departments/:username/bookings/:id/authenticate", function(req, res) {
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, department) {
        if (err) {
            console.log(err);
            req.flash("error", "Oops! Something isn't quite right.");
            return res.redirect("back");
        }

        department.department_details.bookings.forEach(function(booking) {
            if (booking.id === req.params.id) {
                booking.performed_on = new Date().toLocaleString("en-NG");
                booking.performed_by = req.body.performed_by;
                booking.status = 1;
                department.save();
            }
        });

        User.find({ typeOfUser: "doctor" }, function(err, doctors) {
            doctors.forEach(doctor => {
                doctor.doctor_details.bookings.forEach(booking => {
                    if (booking.id === req.params.id) {
                        booking.performed_on = new Date().toLocaleString("en-NG");
                        booking.performed_by = req.body.performed_by;
                        booking.status = 1;
                        doctor.save();
                    }
                });
            });
        });

        Patient.find({}, function(err, patients) {
            patients.forEach(patient => {
                patient.bookings.forEach(booking => {
                    if (booking.id === req.params.id) {
                        booking.performed_on = new Date().toLocaleString("en-NG");
                        booking.performed_by = req.body.performed_by;
                        booking.status = 1;
                        patient.save();
                    }
                });
            });
        });

        return res.redirect("/departments/" + department.username + "/bookings");
    });
});


module.exports = router;