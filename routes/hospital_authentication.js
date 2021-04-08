var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    Patient = require("../models/patient"),
    middleware = require("../middleware"),
    date = new Date(),
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// SHOW(GET): AUTHENTICATION FORM/HOSPITALS
router.get("/hospitals/:username/authenticate", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                return res.render("hospitals/authenticate");
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// SHOW(GET): AUTHENTICATION FORM (FOR PATIENT WITH KNOWN ACCESSION NUMBER)/HOSPITALS
router.get("/hospitals/:username/authenticate/:accession_number", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                var patient = user.hospitalDetails.patients.find(function(el) {
                    return el.accession_number == req.params.accession_number;
                });

                return res.render("hospitals/authenticateWAN", { patient: patient });
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// UPDATE(PUT): AUTHENTICATE A PATIENT/HOSPITALS
router.put("/hospitals/:username/authenticate", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, hospital) {
        if (!err) {
            if (hospital) {
                var accessionNumber = req.body.accession_number;
                // Delete patient from hospital's patients array
                hospital.hospitalDetails.patients.forEach(function(patient, index, patients) {
                    if (patient.accession_number == accessionNumber) {
                        patients.splice(index, 1);
                    }
                });
                // Find patient in patients collection
                Patient.findOne({ accession_number: accessionNumber }, function(err, patient) {
                    if (err) {
                        req.flash("error", "Oops! Something isn't quite right.");
                        return res.redirect("back");
                    }
                    // Find referring doctor and delete patient from referring doctor's patients array
                    User.findOne({ _id: patient.referrer_id }, function(err, referrer) {
                        if (err) {
                            req.flash("error", "Oops! Something isn't quite right.");
                            return res.redirect("back");
                        }
                        var index = referrer.referrerDetails.patients.findIndex(function(el) {
                            return el.accession_number == accessionNumber;
                        });
                        referrer.referrerDetails.patients.splice(index, 1);
                        // Change patient's status to "authenticated"
                        patient.status = "authenticated";
                        // Set patient authentication month & date
                        patient.authentication_month = months[date.getMonth()];
                        patient.authentication_date = date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
                        // Set amount paid by patient 
                        patient.amount_paid = parseInt(req.body.amount_paid, 10);
                        // Calculate referrer commission
                        if (parseInt(req.body.amount_paid, 10) < 5001) {
                            patient.referrer_commission = 0.2 * (parseInt(req.body.amount_paid, 10));
                        } else if (parseInt(req.body.amount_paid, 10) > 5000 && parseInt(req.body.amount_paid, 10) < 20001) {
                            patient.referrer_commission = 0.1 * (parseInt(req.body.amount_paid, 10));
                        } else if (parseInt(req.body.amount_paid, 10) > 20000 && parseInt(req.body.amount_paid, 10) < 50001) {
                            patient.referrer_commission = 0.075 * (parseInt(req.body.amount_paid, 10));
                        } else if (parseInt(req.body.amount_paid, 10) > 50000 && parseInt(req.body.amount_paid, 10) < 100001) {
                            patient.referrer_commission = 0.05 * (parseInt(req.body.amount_paid, 10));
                        } else if (parseInt(req.body.amount_paid, 10) > 100000) {
                            patient.referrer_commission = 0.03 * (parseInt(req.body.amount_paid, 10));
                        }
                        // Update referrer's commission
                        referrer.commission += patient.referrer_commission;
                        // Save patient
                        patient.save(function(err, patient) {
                            if (err) {
                                req.flash("error", "Oops! Something isn't quite right.");
                                return res.redirect("back");
                            }
                            // Push patient into referring doctor's patients array
                            referrer.referrerDetails.patients.unshift(patient);
                            // Save referrer
                            referrer.save(function(err, referrer) {
                                if (err) {
                                    req.flash("error", "Oops! Something isn't quite right.");
                                    return res.redirect("back");
                                }
                                // Push patient into hospital's patients array
                                hospital.hospitalDetails.patients.unshift(patient);
                                // Save hospital
                                hospital.save(function(err, hospital) {
                                    if (err) {
                                        req.flash("error", "Oops! Something isn't quite right.");
                                        return res.redirect("back");
                                    }
                                    return res.redirect("/hospitals/" + hospital.username + "/patients");
                                })
                            });
                        });
                    });
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