var express = require("express"),
    uniqid = require("uniqid"),
    router = express.Router(),
    User = require("../models/user"),
    Patient = require("../models/patient");

// SHOW(GET): SHOW DEPARTMENTAL REPORTS
router.get("/departments/:username/reports", function(req, res) {
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                return res.render("departments/reports", { user });
            }
            req.flash("error", "Please login.");
            return res.redirect("/accounts/departments/login");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// SHOW(GET): SHOW FORM TO WRITE A NEW REPORT
router.get("/departments/:username/bookings/:bookingId/new-report", function(req, res) {
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                return res.render("departments/newReport", { user, bookingId: req.params.bookingId });
            }
            req.flash("error", "Please login.");
            return res.redirect("/accounts/departments/login");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// CREATE(POST): CREATE A NEW REPORT
router.post("/departments/:username/bookings/:bookingId/reports", function(req, res) {
    // Find department
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                // Create a new report object
                var newReport = {
                    id: uniqid.process(),
                    booking_id: req.params.bookingId,
                    department_id: user._id,
                    department_name: user.department_details.name,
                    investigation: req.body.investigation,
                    body: req.body.body,
                    reported_by: req.body.reported_by,
                    reported_on: new Date().toLocaleString("en-NG")
                };
                // Push report into department reports array
                user.department_details.reports.unshift(newReport);

                // Find booking attached to department & push report into booking
                user.department_details.bookings.forEach(booking => {
                    if (booking.id === req.params.bookingId) {
                        booking.reports.unshift(newReport);
                        // Save department
                        user.save();
                    }
                });

                // Find booking attached to doctor & push report into booking
                User.find({ typeOfUser: "doctor" }, function(err, doctors) {
                    if (err) {
                        console.log(err);
                        req.flash("error", "Oops! Something isn't quite right.")
                        return res.redirect("back");
                    }
                    doctors.forEach(doctor => {
                        doctor.doctor_details.bookings.forEach(booking => {
                            if (booking.id === req.params.bookingId) {
                                booking.reports.unshift(newReport);
                                // Save doctor
                                doctor.save();
                            }
                        });
                    });
                });

                // Find booking attached to patient & push report into booking
                Patient.find({}, function(err, patients) {
                    if (err) {
                        console.log(err);
                        req.flash("error", "Oops! Something isn't quite right.")
                        return res.redirect("back");
                    }
                    patients.forEach(patient => {
                        patient.bookings.forEach(booking => {
                            if (booking.id === req.params.bookingId) {
                                booking.reports.unshift(newReport);
                                // Save patient
                                patient.save();
                            }
                        });
                    });
                });

                // Save user
                user.save();

                // Redirect to departmental reports page
                return res.redirect("/departments/" + user.username + "/reports");
            }
            req.flash("error", "Please login.");
            return res.redirect("/accounts/departments/login");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// SHOW(GET): ALL REPORTS ATTACHED TO A PARTICULAR BOOKING
router.get("/departments/:username/bookings/:bookingId/reports", function(req, res) {
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                var reports = user.department_details.reports.filter(el => el.booking_id === req.params.bookingId);
                return res.render("departments/showBookingReports", { user, reports });
            }
            req.flash("error", "Please login.");
            return res.redirect("/accounts/departments/login");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

module.exports = router;