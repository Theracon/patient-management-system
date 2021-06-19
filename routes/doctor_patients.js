var express = require("express"),
    uniqid = require("uniqid"),
    router = express.Router(),
    User = require("../models/user"),
    Patient = require("../models/patient");


// SHOW(GET): FORM TO SEARCH FOR PATIENT
router.get('/doctors/:username/patients/find-patient', function(req, res) {
    User.findOne({ typeOfUser: "doctor", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                return res.render("doctors/findPatient", { user });
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/accounts/doctors/login");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// SHOW(GET): FORM TO SEARCH FOR PATIENT
router.get('/doctors/:username/patients/search', function(req, res) {
    User.findOne({ typeOfUser: "doctor", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                return res.render("doctors/searchPatient", { user });
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/accounts/doctors/login");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// SHOW(POST): FETCH PATIENT FROM DATABASE
router.post("/doctors/:username/patients/find-patient", function(req, res) {
    User.findOne({ typeOfUser: "doctor", username: req.params.username }, function(err, doctor) {
        if (err) {
            console.log(err);
            req.flash("error", "Oops! Something isn't quite right.")
            return res.redirect("back");
        }

        Patient.findOne({ accession_number: req.body.accession_number }, function(err, patient) {
            if (err) {
                console.log(err);
                req.flash("error", "Oops! Something isn't quite right.")
                return res.redirect("back");
            }

            if (patient) {
                res.redirect("/doctors/" + doctor.username + "/patients/" + patient.accession_number + "/new-booking");
            } else {
                req.flash("error", "Patient not found.");
                return res.redirect("back");
            }

        });
    });
});

// SHOW(POST): FETCH PATIENT FROM DATABASE
router.post("/doctors/:username/patients/search", function(req, res) {
    User.findOne({ typeOfUser: "doctor", username: req.params.username }, function(err, doctor) {
        if (err) {
            console.log(err);
            req.flash("error", "Oops! Something isn't quite right.")
            return res.redirect("back");
        }

        Patient.findOne({ accession_number: req.body.accession_number }, function(err, patient) {
            if (err) {
                console.log(err);
                req.flash("error", "Oops! Something isn't quite right.")
                return res.redirect("back");
            }

            if (patient) {
                res.redirect("/doctors/" + doctor.username + "/patients/" + patient.accession_number);
            } else {
                req.flash("error", "Patient not found.");
                return res.redirect("back");
            }

        });
    });
});

// SHOW(GET): FORM TO CREATE A NEW BOOKING FOR INVESTIGATIONS
router.get('/doctors/:username/patients/:accession_number/new-booking', function(req, res) {
    User.findOne({ typeOfUser: "doctor", username: req.params.username }, function(err, user) {
        if (err) {
            console.log(err);
            req.flash("error", "Oops! Something isn't quite right.")
            return res.redirect("back");
        }

        User.find({ typeOfUser: "department" }, function(err, data) {
            if (err) {
                console.log(err);
                req.flash("error", "Oops! Something isn't quite right.")
                return res.redirect("back");
            }

            var departments = data.filter(el => el.department_details);

            Patient.findOne({ accession_number: req.params.accession_number }, function(err, patient) {
                if (err) {
                    console.log(err);
                    req.flash("error", "Oops! Something isn't quite right.")
                    return res.redirect("back");
                }

                res.render("doctors/newBooking", { user, patient, departments });
            });
        });
    });
});

// SHOW(GET): FORM TO CREATE A NEW BOOKING FOR INVESTIGATIONS
router.get('/doctors/:username/patients/:accession_number', function(req, res) {
    User.findOne({ typeOfUser: "doctor", username: req.params.username }, function(err, user) {
        if (err) {
            console.log(err);
            req.flash("error", "Oops! Something isn't quite right.")
            return res.redirect("back");
        }

        User.find({ typeOfUser: "department" }, function(err, data) {
            if (err) {
                console.log(err);
                req.flash("error", "Oops! Something isn't quite right.")
                return res.redirect("back");
            }

            var departments = data.filter(el => el.department_details);

            Patient.findOne({ accession_number: req.params.accession_number }, function(err, patient) {
                if (err) {
                    console.log(err);
                    req.flash("error", "Oops! Something isn't quite right.")
                    return res.redirect("back");
                }

                res.render("doctors/patientInfo", { user, patient, departments });
            });
        });
    });
});

// CREATE(POST): LOGIC TO CREATE A NEW BOOKING FOR INVESTIGATIONS
router.post("/doctors/:username/patients/:accession_number/new-booking", function(req, res) {
    User.findOne({ typeOfUser: "doctor", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                // Create a new Booking object
                var newBooking = {
                    id: uniqid.process(),
                    date: new Date().toLocaleString("en-NG"),
                    doctor: "Doctor " + user.doctor_details.firstname + " " + user.doctor_details.middlename + " " + user.doctor_details.lastname,
                    status: 0,
                    data: []
                };

                if (typeof req.body.department_ids == "object") {
                    for (var i = 0; i < req.body.department_ids.length; i++) {
                        newBooking.data.push({
                            department_id: req.body.department_ids[i],
                            investigations: req.body.investigations[i]
                        });
                    }
                } else {
                    newBooking.data.push({
                        department_id: req.body.department_ids,
                        investigations: req.body.investigations
                    });
                }

                // Find involved patient, 
                // add the new booking object to patient's bookings, 
                // and save patient
                Patient.findOne({ accession_number: req.params.accession_number }, function(err, patient) {
                    if (err) console.log(err);

                    newBooking.patient = `${patient.firstname} ${patient.middlename} ${patient.lastname}`;
                    patient.bookings.unshift(newBooking);
                    patient.save(function(err, patient) {
                        if (err) {
                            console.log(err);
                            req.flash("error", "Oops! Something isn't quite right.")
                            res.redirect("back");
                        }

                        // Add the new booking object to doctor bookings and save doctor
                        user.doctor_details.bookings.unshift(newBooking);

                        // Save doctor
                        user.save();

                        // Find all departments involved, 
                        // add the new booking object to their bookings, 
                        // and save all departments involved
                        User.find({ typeOfUser: "department" }, function(err, departments) {
                            departments.forEach(department => {
                                newBooking.data.forEach(el => {
                                    if (el.department_id == department._id) {
                                        department.department_details.bookings.unshift(newBooking);
                                        department.save(function(err, department) {
                                            if (err) {
                                                console.log(err);
                                                req.flash("error", "Oops! Something isn't quite right.")
                                                res.redirect("back");
                                            }
                                        });
                                    }
                                });
                            });

                            // Redirect to doctor's bookings page
                            console.log(newBooking);
                            return res.redirect("/doctors/" + user.username + "/bookings");
                        });
                    });
                });

                return;
            }
            req.flash("error", "Please login to continue.");
            return res.redirect("/accounts/doctors/login");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// SHOW(GET): SHOW ALL BOOKINGS FOR A DOCTOR
router.get("/doctors/:username/bookings", function(req, res) {
    User.findOne({ typeOfUser: "doctor", username: req.params.username }, function(err, user) {
        if (err) {
            console.log(err);
            req.flash("error", "Oops! Something isn't quite right.")
            return res.redirect("back");
        }
        if (user) {
            res.render("doctors/bookings", { user });
        } else {
            req.flash("error", "Please login to continue.");
            return res.redirect("back");
        }
    });
});

module.exports = router;