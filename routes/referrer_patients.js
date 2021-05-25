var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    Patient = require("../models/patient"),
    hospitalCount = '',
    referrerCount = '',
    patientCount = '',
    uniqid = require("uniqid"),
    middleware = require("../middleware"),
    functions = require("../functions"),
    date = new Date(),
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// SHOW(GET): FORM TO ADD A NEW PATIENT/REFERRERS
router.get('/referrers/:username/patients/new', middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    // Find referrer in database
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
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
                            return res.render("referrers/newPatient", { hospitals: hospitals, hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
                        });
                    });
                });
                return;
            }
            req.flash("error", "Please login or create an account.");
            res.redirect("/login");
            return;
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// CREATE(POST): LOGIC TO ADD A NEW PATIENT/REFERRERS
router.post("/referrers/:username/patients", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    if (req.body.hospital && parseInt(req.body.hospital, 10) >= 0) {
        var hospitalArray, hospital;

        User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
            if (err) {
                req.flash("error", "Oops! Something isn't quite right.");
                return res.redirect("back");
            }

            hospitalArray = hospitals.slice();
            hospital = hospitalArray[req.body.hospital];

            // Find referrer in database
            User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
                if (!err) {
                    if (user) {
                        date = new Date();

                        // Make a new patient object
                        var patient = new Patient({
                            // Initialize patient's basic info
                            name: req.body.name,
                            investigation: req.body.investigation,
                            phone: req.body.phone,
                            hospital_name: hospital.hospitalDetails.name,
                            hospital_address: hospital.hospitalDetails.address,
                            hospital_id: hospital._id,
                            accession_number: uniqid.time("", Math.floor(Math.random() * 100)).toUpperCase(),
                            status: "unauthenticated",
                            referrer: user.referrerDetails.title + " " + user.referrerDetails.name,
                            referrer_id: user._id,

                            // Initialize patient's finances
                            amount_paid: 0,
                            hospital_commission: 0,
                            referrer_commission: 0,
                            platform_commission: 0,

                            // Initialize patient's referral info
                            referral_year: date.getFullYear(),
                            referral_month: months[date.getMonth()],
                            referral_date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                            referral_time: functions.formatTime(date),
                        });

                        // Create notification to notify referral hospital
                        var referralMessage = {
                            date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                            time: functions.formatTime(date),
                            content: `Hi ${hospital.hospitalDetails.name}, A patient with the following details has been referred to you - 
                                        Name: ${patient.name},
                                        Phone number: ${patient.phone}, 
                                        Investigations: ${patient.investigation},
                                        Referrer: ${user.referrerDetails.title} ${user.referrerDetails.name}`,
                            status: "unread"
                        }

                        // Send notification to hospital
                        hospital.hospitalDetails.notifications.unshift(referralMessage);

                        // Update hospital's notifications count
                        hospital.hospitalDetails.unread_notifications_count++;

                        // Save hospital data
                        hospital.save(function(err, hospital) {});

                        // Save patient data
                        patient.save(function(err, patient) {
                            // Find hospital
                            User.findOne({ typeOfUser: "hospital", _id: hospitalArray[req.body.hospital]._id }, function(err, hospital) {
                                if (hospital) {
                                    hospital.hospitalDetails.patients.unshift(patient);
                                    // Save hospital
                                    hospital.save(function(err, hospital) {
                                        if (err) {
                                            req.flash("error", "Oops! Something isn't quite right.");
                                            return res.redirect("back");
                                        }
                                        // Move into referrer's patients array in database
                                        user.referrerDetails.patients.unshift(patient);
                                        // Update referrer patient_count
                                        user.referrerDetails.patient_count++;
                                        // Save updated user details to the database
                                        user.save(function(err, user) {
                                            if (!err) {
                                                req.flash("success", "Congratulations! You referred a patient.");
                                                res.redirect("/referrers/" + user.username + "/patients/" + patient.accession_number);
                                                return;
                                            }
                                            req.flash("error", "Oops! Something isn't quite right.")
                                            res.redirect("back");
                                            return;
                                        });
                                    });
                                } else {
                                    req.flash("error", "Oops! Something isn't quite right.")
                                    return res.redirect("back");
                                }
                            });
                        });
                        return;
                    }
                    req.flash("error", "Please login or create an account.");
                    res.redirect("/login");
                    return;
                }
                req.flash("error", "Oops! Something isn't quite right.")
                res.redirect("back");
            });
        });
    } else {
        req.flash("error", "Please select a hospital.");
        res.redirect("back");
    }
});

// SHOW(GET): PATIENT DETAILS/REFERRERS
router.get("/referrers/:username/patients/:accession_number", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
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
                                return res.render("referrers/patientDetails", { patient: patient, hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
                            });
                        });
                    });
                    return;
                });
                return;
            }
            req.flash("error", "Please login or create an account.");
            res.redirect("/login");
            return;
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// SHOW(GET): FORM TO EDIT PATIENT DETAILS/REFERRERS
router.get("/referrers/:username/patients/:accession_number/edit", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    // Find referrer
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
                    if (err) {
                        req.flash("error", "Oops! Something isn't quite right.")
                        return res.redirect("back");
                    }

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
                                    return res.render("referrers/editPatient", { patient: patient, hospitals: hospitals, hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
                                });
                            });
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

// UPDATE(PUT): UPDATE PATIENT DETAILS/REFERRERS
router.put("/referrers/:username/patients/:accession_number", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    var hospitalArray;

    User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
        hospitalArray = hospitals.slice();
    });

    if (req.body.hospital && parseInt(req.body.hospital, 10) >= 0) {
        // Find referrer
        User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
            if (!err) {
                if (user) {
                    date = new Date();

                    // Find and update patient in patient model
                    Patient.findOne({ accession_number: req.params.accession_number }, function(err, patient) {
                        if (err) {
                            req.flash("error", "Oops! Something isn't quite right.")
                            return res.redirect("back");
                        }
                        patient.hospital_id = hospitalArray[req.body.hospital]._id;
                        patient.hospital_name = hospitalArray[req.body.hospital].hospitalDetails.name;
                        patient.address = hospitalArray[req.body.hospital].hospitalDetails.address;
                        patient.name = req.body.name;
                        patient.investigation = req.body.investigation;
                        patient.phone = req.body.phone;
                        patient.referral_time = functions.formatTime(date);
                        referral_month = months[date.getMonth()];
                        // Save updated patient
                        patient.save(function(err, patient) {
                            if (err) {
                                req.flash("error", "Oops! Something isn't quite right.")
                                return res.redirect("back");
                            }
                            // Find and remove patient in referrer's patients array
                            var id = req.params.patientId;

                            function spliceElement(arr) {
                                var index = arr.findIndex(function(element) {
                                    return element._id === id;
                                });
                                arr.splice(index, 1);
                            }
                            spliceElement(user.referrerDetails.patients);
                            // Add new patient to referrer's patient array
                            user.referrerDetails.patients.unshift(patient);
                            // Save referrer with updated patients array
                            user.save(function(err, user) {
                                if (err) {
                                    req.flash("error", "Oops! Something isn't quite right.")
                                    return res.redirect("back");
                                }
                                // Redirect to patient show route
                                req.flash("success", "Patient info edited.");
                                return res.redirect("/referrers/" + user.username + "/patients/" + patient.accession_number);
                            });
                        });
                    });
                    return;
                }
                req.flash("error", "Please login or create an account.");
                res.redirect("/login");
                return;
            }
            req.flash("error", "Oops! Something isn't quite right.")
            res.redirect("back");
        });
    } else {
        req.flash("error", "No hospital selected! Please select a hospital.");
        res.redirect("back");
    }
});

// SHOW(GET): REFERRER'S PATIENTS/REFERRERS
router.get("/referrers/:username/patients", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    // Find referrer
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                // Extract referrer's patients array and save it to a variable
                var patients = user.referrerDetails.patients;

                // Fetch all hospitals
                User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
                    hospitalCount = hospitals.length;
                    // Fetch all referrers
                    User.find({ typeOfUser: "referrer" }, function(err, referrers) {
                        referrerCount = referrers.length;
                        Patient.find({}, function(err, allPatients) {
                            patientCount = allPatients.length;
                            return res.render("referrers/patients", { patients, hospitalCount, referrerCount, patientCount });
                        });
                    });
                });
                return;
            }
            req.flash("error", "Please login or create an account.");
            res.redirect("/login");
            return;
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

module.exports = router;