var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    Patient = require("../models/patient"),
    hospitalCount = '',
    referrerCount = '',
    patientCount = '',
    middleware = require("../middleware"),
    functions = require("../functions"),
    date = new Date(),
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// SHOW(GET): AUTHENTICATION FORM/HOSPITALS
router.get("/hospitals/:username/authenticate", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
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
                            return res.render("hospitals/authenticate", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
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

// SHOW(GET): AUTHENTICATION FORM (FOR PATIENT WITH KNOWN ACCESSION NUMBER)/HOSPITALS
router.get("/hospitals/:username/authenticate/:accession_number", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                var patient = user.hospitalDetails.patients.find(function(el) {
                    return el.accession_number == req.params.accession_number;
                });

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
                            return res.render("hospitals/authenticateWAN", { patient: patient, hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
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

// UPDATE(PUT): LOGIC TO AUTHENTICATE A PATIENT/HOSPITALS
router.put("/hospitals/:username/authenticate", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    // Check the format of entered amount
    if (isNaN(req.body.amount_paid)) {
        req.flash("error", "Amount paid must be a number.");
        return res.redirect("back");
    } else {
        date = new Date();

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
                        // Check for incorrect accession number
                        if (!patient) {
                            req.flash("error", "Incorrect accession number.");
                            return res.redirect("back");
                        } else {
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
                                // Set patient's authentication info
                                patient.authentication_year = date.getFullYear();
                                patient.authentication_month = months[date.getMonth()];
                                patient.authentication_date = date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
                                patient.authentication_time = functions.formatTime(date);
                                // Set amount paid by patient 
                                patient.amount_paid = parseInt(req.body.amount_paid, 10);

                                // Set patient commission rates
                                patient.commission_rate = req.body.commission_rate;

                                // Calculate referrer commission
                                patient.hospital_commission = (patient.commission_rate / 100) * (parseInt(req.body.amount_paid, 10));
                                patient.referrer_commission = 0.9 * patient.hospital_commission;
                                patient.platform_commission = patient.hospital_commission - patient.referrer_commission;

                                // Update referrer's commission
                                referrer.referrerDetails.commission += patient.referrer_commission;
                                // Save patient
                                patient.save(function(err, patient) {
                                    if (err) {
                                        req.flash("error", "Oops! Something isn't quite right.");
                                        return res.redirect("back");
                                    }
                                    // Push patient into referring doctor's patients array
                                    referrer.referrerDetails.patients.unshift(patient);

                                    // Create notification to referrer
                                    var authenticationMessage = {
                                        date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                                        time: functions.formatTime(date),
                                        content: `Hi ${referrer.referrerDetails.title} ${referrer.referrerDetails.firstname}, Your patient with the following details has been authenticated - 
                                                    Name: ${patient.name}, 
                                                    Investigations: ${patient.investigation}, 
                                                    Referral hospital: ${patient.hospital_name}`,
                                        status: "unread"
                                    }

                                    // Send notification to referrer
                                    referrer.referrerDetails.notifications.unshift(authenticationMessage);

                                    // Update referrer's notifications count
                                    referrer.referrerDetails.unread_notifications_count++;

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
                        }
                    });
                    return;
                }
                req.flash("error", "Please login or create an account.");
                return res.redirect("/login");
            }
            req.flash("error", "Oops! Something isn't quite right.")
            res.redirect("back");
        });
    }
});

module.exports = router;