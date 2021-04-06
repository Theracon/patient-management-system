var express                 = require("express"),
    router                  = express.Router(),
    User                    = require("../models/user"),
    Patient                 = require("../models/patient"),
    uniqid                  = require("uniqid"),
    middleware              = require("../middleware"),
    functions               = require("../functions"),
    date                    = new Date(),
    months                  = ['January','February','March','April','May','June','July', 'August','September','October','November','December'];

// SHOW: FORM TO ADD NEW PATIENT/REFERRERS
router.get('/referrers/:username/patients/new', middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function (req, res) {
    // Find referrer in database
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
                    if(err) {
                        req.flash("error", "Oops! Something isn;t quite right.");
                        return res.redirect("back");
                    }
                    return res.render("referrers/newPatient", { hospitals: hospitals });
                });
                return;
            }
            req.flash("error", "Please login or create an account.");
            res.redirect("/login");
            return;
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// CREATE: ADD NEW PATIENT/REFERRERS
router.post("/referrers/:username/patients", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    if(req.body.hospital && parseInt(req.body.hospital, 10) >= 0) {
        var hospitalArray = [];
    
        User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
            if(err) {
                req.flash("error", "Oops! Something isn't quite right.");
                return res.redirect("back");
            }
    
            hospitalArray = hospitals.slice();
    
            // Find referrer in database
            User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
                if(!err) {
                    if(user) {
                        // Make a new patient object
                        var patient = new Patient({
                            name: req.body.name,
                            investigation: req.body.investigation,
                            phone: req.body.phone,
                            hospital_name: hospitalArray[req.body.hospital].hospitalDetails.name,
                            hospital_address: hospitalArray[req.body.hospital].hospitalDetails.address,
                            hospital_id: hospitalArray[req.body.hospital]._id,
                            accession_number: uniqid.time("", Math.floor(Math.random() * 100)).toUpperCase(),
                            status: "unauthenticated",
                            referrer: user.referrerDetails.title + " " + user.referrerDetails.name,
                            referrer_id: user._id,
                            amount_paid: 0,
                            referrer_commission: 0,
                            referral_month: months[date.getMonth()],
                            referral_date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                            referral_time: functions.formatTime(date),
                        });
        
                        patient.save(function(err, patient) {
                            // Find hospital
                            User.findOne({ typeOfUser: "hospital", _id: hospitalArray[req.body.hospital]._id }, function(err, hospital) {
                                if(hospital) {
                                    console.log(hospital);
        
                                    hospital.hospitalDetails.patients.unshift(patient);
                                    // Save hospital
                                    hospital.save(function(err, hospital) {
                                        if(err) {
                                            req.flash("error", "Oops! Something isn't quite right.");
                                            return res.redirect("back");
                                        }
                                        // Move into referrer's patients array in database
                                        user.referrerDetails.patients.unshift(patient);
                                        // Update referrer patient_count
                                        user.referrerDetails.patient_count++;
                                        // Save updated user details to the database
                                        user.save(function(err, user) {
                                            if(!err) {
                                                req.flash("success", "Patient referral successful.");
                                                res.redirect("/referrers/" + user.username + "/patients/" + patient.accession_number);
                                                return;
                                            }
                                            req.flash("error", "Oops! An error occurred.");
                                            res.redirect("back");
                                            return;
                                        });
                                    });
                                } else {
                                    console.log("No such hospital");
                                    req.flash("Oops! Something isn't quite right");
                                    return res.redirect("back");
                                }
                            });
                        });
                        return;
                    }
                    req.flash("error", "Please login or create an account.");
                    console.log("error at patient create route");
                    res.redirect("/login");
                    return;
                }
                req.flash("error", "Oops! An error occurred.");
                res.redirect("back");
            });
        });
    } else {
        req.flash("error", "Please select a hospital.");
        res.redirect("back");
    }
});

// SHOW: PATIENT DETAILS/REFERRERS
router.get("/referrers/:username/patients/:accession_number", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    // Find referrer
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                // Find patient
                Patient.findOne({ accession_number: req.params.accession_number }, function(err, patient) {
                    return res.render("referrers/patientDetails", { patient: patient });
                });
                return;
            }
            req.flash("error", "Please login or create an account.");
            res.redirect("/login");
            console.log("error at success route");
            return;            
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// SHOW: FORM TO EDIT PATIENT DETAILS/REFERRERS
router.get("/referrers/:username/patients/:accession_number/edit", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    // Find referrer
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
            // Find patient
            Patient.findOne({ accession_number: req.params.accession_number }, function(err, patient) {
                if(err) {
                    req.flash("error", "Oops! An error occurred.");
                    res.redirect("back");
                    return;
                }
                // Render patient edit template
                return res.render("referrers/editPatient", { user: user, patient: patient });
            });
            return;
            }
            req.flash("error", "Please login or create an account.");
            res.redirect("/login");
            console.log("error at success find patient");
            return;            
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// UPDATE: UPDATE PATIENT DETAILS/REFERRERS
router.put("/referrers/:username/patients/:accession_number", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    var hospitals;

    User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
        hospitals = hospitals.slice()
    });

    if(hospitals[req.body.hospital]) {
        // Find referrer
        User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
            if(!err) {
                if(user) {
                    // Find and update patient in patient model
                    Patient.findOne({ accession_number: req.params.accession_number }, function(err, patient) {
                        if(err) {
                            req.flash("error", "Oops! An error occurred.");
                            return res.redirect("back");
                        }
                        patient.hospital = hospitals[req.body.hospital];
                        patient.name = req.body.name;
                        patient.investigation = req.body.investigation;
                        patient.phone = req.body.phone;
                        patient.referral_time = functions.formatTime(date);
                        referral_month = months[date.getMonth()];
                        // Save updated patient
                        patient.save(function(err, patient) {
                            if(err) {
                                req.flash("error", "Oops! An error occurred.");
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
                                if(err) {
                                    req.flash("error", "Oops! An error occurred.");
                                    return res.redirect("back");
                                }
                                // Redirect to patient show route
                                req.flash("success", "You edited a patient.");
                                return res.redirect("/referrers/" + user.username + "/patients/" + patient.accession_number);
                            });
                        });
                    });
                    return;
                }
                req.flash("error", "Please login or create an account.");
                res.redirect("/login");
                console.log("error at success find patient");
                return;            
            }
            req.flash("error", "Oops! An error occurred.");
            res.redirect("back");
        });
    } else {
        req.flash("error", "No hospital selected! Please select a hospital.");
        res.redirect("back");
    }
});

// SHOW: REFERRER'S PATIENTS/REFERRERS
router.get("/referrers/:username/patients", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    // Find referrer
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                // Extract referrer's patients array and save it to a variable
                var patients = user.referrerDetails.patients;
                // Render patients template, pass in referrer's patients array
                res.render("referrers/patients", { patients: patients }); 
                return;
            }
            req.flash("error", "Please login or create an account.");
            res.redirect("/login");
            console.log("error at success find patient");
            return;
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

module.exports = router;