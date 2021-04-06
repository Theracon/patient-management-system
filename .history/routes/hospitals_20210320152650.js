var express         = require("express"),
    router          = express.Router(),
    User            = require("../models/user"),
    Patient         = require("../models/patient"),
    middleware      = require("../middleware"),
    functions       = require("../functions"),
    date            = new Date(),
    months          = ['January','February','March','April','May','June','July', 'August','September','October','November','December'],
    hospitalType    = ["Teaching Hospital", "Specialist Hospital", "General Hospital", "Primary Healthcare Centre", "Diagnostic Centre", "Other"];

// SHOW(GET): FORM TO CREATE PROFILE/HOSPITALS
router.get("/hospitals/:username/details", middleware.isUserLoggedIn, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                return res.render("hospitals/createProfile");
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// CREATE(POST): CREATE PROFILE/HOSPITALS
router.post('/hospitals/:username/update', middleware.isUserLoggedIn, function (req, res) {
    
    var institution_type = req.body.institution_type;

    if(institution_type === "-1") {
        req.flash("error", "Please select institution type.");
        document.getElementById("institution_type").focus();
        res.redirect("back");
    } else {
        // Find hospital in database, then update hospital info
        User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
            if(!err) {
                if(user) {
                    user.role = 0;
                    user.hospitalDetails = {
                        institution_type: hospitalType[parseInt(req.body.institution_type, 10)],
                        name: req.body.name,
                        address: req.body.address,
                        email: req.body.email,
                        phone: req.body.phone,
                        website: req.body.website,
                        cmd: req.body.cmd,
                        ceo: req.body.ceo,
                        consultants: req.body.consultants,
                        doctors: req.body.doctors,
                        update_count: 0
                    }
                    // Create admin message
                    var welcomeMessage = {
                        date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                        time: functions.formatTime(date),
                        content: "Hi, " + user.hospitalDetails.name + ", we're pleased to have you on PatientRef. Feel free to use the FAQs section if you need clarifications or reach us by phone or email.",
                        status: "unread"
                    }
                    // Push welcome message into hospital notifications array
                    user.hospitalDetails.notifications.push(welcomeMessage);
                    // Update hospital's unread notifications count
                    user.hospitalDetails.unread_notifications_count = 1;
                    // Save updated user
                    user.save(function(err, savedUser) {
                        req.flash("success", "Step two completed.");
                        return res.redirect('/hospitals/' + savedUser.username + '/departments');
                    })
                    return;
                }
                req.flash("error", "Oops! An error occurred.");
                res.redirect("back");
            }
        });
    }
});

// SHOW(GET): SHOW FORM TO CREATE HOSPITAL DEPARTMENTS/HOSPITALS
router.get("/hospitals/:username/departments", middleware.isUserLoggedIn, middleware.isHospitalProfileCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                return res.render("hospitals/createDepartments");
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// CREATE(POST): CREATE HOSPITAL DEPARTMENTS/HOSPITALS
router.post("/hospitals/:username/departments", middleware.isUserLoggedIn, middleware.isHospitalProfileCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                if(typeof req.body.name == "object") {
                    for(var i = 0; i < req.body.name.length; i++) {
                        user.hospitalDetails.departments.push({
                            name: req.body.name[i],
                            staff_count: req.body.staff_count[i],
                            procedures: req.body.procedures[i],
                        });
                    }
                } else {
                    user.hospitalDetails.departments.push({
                        name: req.body.name,
                        staff_count: req.body.staff_count,
                        procedures: req.body.procedures,
                    });
                }

                user.role = 0.75;
                user.save(function(err, user) {
                    req.flash("success", "You created your profile!");
                    return res.redirect("/hospitals/" + user.username + "/pending");
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

// SHOW(GET): SHOW FORM TO CREATE HOSPITAL PROCEDURES/HOSPITALS
router.get("/hospitals/:username/procedures", middleware.isUserLoggedIn, middleware.isHospitalProfileCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                return res.render("hospitals/createProcedures");
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// CREATE(POST): HOSPITAL PROCEDURES/HOSPITALS
router.post("/hospitals/:username/procedures", middleware.isUserLoggedIn, middleware.isHospitalProfileCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                for(var i = 0; i < req.body.procedures.length; i++) {
                    user.hospitalDetails.procedures.push(req.body.procedures[i]);
                }
                user.role = 0.75;
                user.save(function(err, user) {
                    req.flash("success", "You created your profile!");
                    return res.redirect("/hospitals/" + user.username + "/pending");
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

// SHOW(GET): HOSPITAL DASHBOARD/HOSPITALS
router.get("/hospitals/:username/dashboard", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                if(user.role === 1) {
                    return res.render("hospitals/dashboard");
                } else {
                    return res.redirect("/hospitals/" + user.username + "/pending");
                }
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// SHOW(GET): ACTIVATION PENDING/HOSPITALS
router.get("/hospitals/:username/pending", middleware.isUserLoggedIn, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                if(user.role === 1) {
                    return res.redirect("/hospitals/" + user.username + "/dashboard");
                } else {
                    return res.render("hospitals/pending");
                }
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// SHOW(GET): NOTIFICATIONS/HOSPITALS
router.get("/hospitals/:username/notifications", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                return res.render("hospitals/notifications");
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// SHOW(GET): SHOW A NOTIFICATION/HOSPITALS
router.get("/hospitals/:username/notifications/:id", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                var notify;

                // Update hospital's unread notifications count and update status to "read"
                user.hospitalDetails.notifications.forEach(function(notification) {
                    if(notification._id == req.params.id && notification.status == "unread") {
                        if(user.hospitalDetails.unread_notifications_count > 0) {
                            user.hospitalDetails.unread_notifications_count--;
                        }
                        notification.status = "read";
                        notify = notification;
                    } else if(notification._id == req.params.id && notification.status == "read") {
                        notify = notification;
                    } else {
                        notify = notification;
                    }
                });
                // Save updated user
                user.save(function(err, user) {
                    if(err) {
                        req.flash("error", "Oops! An error occurred.");
                        return res.redirect("back");
                    }
                    return res.render("hospitals/showNotification", { notify });
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

// SHOW(GET): AUTHENTICATION FORM/HOSPITALS
router.get("/hospitals/:username/authenticate", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                return res.render("hospitals/authenticate");
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
        if(!err) {
            if(hospital) {
                var accessionNumber = req.body.accession_number;
                // Delete patient from hospital's patients array
                hospital.hospitalDetails.patients.forEach(function(patient, index, patients) {
                    if(patient.accession_number == accessionNumber) {
                        patients.splice(index, 1);
                    }
                });
                // Find patient in patients collection
                Patient.findOne({ accession_number: accessionNumber }, function(err, patient) {
                    if(err) {
                        req.flash("error", "Oops! Something isn't quite right.");
                        return res.redirect("back");
                    }
                    // Find referring doctor and delete patient from referring doctor's patients array
                    User.findOne({ _id: patient.referrer_id }, function(err, referrer) {
                        if(err) {
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
                        if(parseInt(req.body.amount_paid, 10) < 5000) {
                            patient.referrer_commission = 0.1 * (parseInt(req.body.amount_paid, 10));
                        } else if(parseInt(req.body.amount_paid, 10) < 20000) {
                            patient.referrer_commission = 0.075 * (parseInt(req.body.amount_paid, 10));
                        } else if(parseInt(req.body.amou))
                        // Save patient
                        patient.save(function(err, patient) {
                            if(err) {
                                req.flash("error", "Oops! Something isn't quite right.");
                                return res.redirect("back");
                            }
                            // Push patient into referring doctor's patients array
                            referrer.referrerDetails.patients.unshift(patient);
                            // Save referrer
                            referrer.save(function(err, referrer) {
                                if(err) {
                                    req.flash("error", "Oops! Something isn't quite right.");
                                    return res.redirect("back");
                                }
                                // Push patient into hospital's patients array
                                hospital.hospitalDetails.patients.unshift(patient);
                                // Save hospital
                                hospital.save(function(err, hospital) {
                                    if(err) {
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

// SHOW(GET): AUTHENTICATION FORM FOR PATIENT WITH KNOWN ACCESSION NUMBER/HOSPITALS
router.get("/hospitals/:username/authenticate/:accession_number", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
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

// SHOW(GET): ALL PATIENTS/HOSPITALS
router.get("/hospitals/:username/patients", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                // Extract hospital's patients array and save it to a variable
                var patients = user.hospitalDetails.patients;
                // Render patients template, pass in hospital's patients array
                return res.render("hospitals/patients", { patients: patients }); 
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// SHOW: A PATIENT'S DETAILS/HOSPITALS
router.get("/hospitals/:username/patients/:accession_number", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                Patient.findOne({ accession_number: req.params.accession_number }, function(err, patient) {
                    return res.render("hospitals/patientDetails", { patient: patient, user: user });
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

// SHOW(GET): PROFILE/HOSPITALS
router.get('/hospitals/:username/profile', middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function (req, res) {
    // Find referrer from database
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                return res.render("hospitals/profile");
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// SHOW(GET): PROFILE EDIT FORM/HOSPITALS
router.get("/hospitals/:username/profile/edit", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                res.render("hospitals/editProfile");
                return;
            }
            req.flash("error", "Please create an account.");
            res.redirect("/hospitals/register");
            return;
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// UPDATE(PUT): UPDATE PROFILE/HOSPITALS
router.put("/hospitals/:username/update", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    // Find hospital in database, then update hospital info
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                var institutionType;
                var updateMessage = {
                    date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                    time: functions.formatTime(date),
                    content: "Hi, " + user.hospitalDetails.name + ", You updated your profile. Please let us know if you didn't authorize this.",
                    status: "unread"
                }

                if(req.body.institution_type[1]) {
                    institutionType = hospitalType[parseInt(req.body.institution_type[1], 10)];
                } else {
                    institutionType = hospitalType[parseInt(req.body.institution_type[0], 10)];
                }
                
                user.hospitalDetails.institution_type = institutionType;    
                user.hospitalDetails.name = req.body.name;
                user.hospitalDetails.address = req.body.address;
                user.hospitalDetails.email = req.body.email;
                user.hospitalDetails.phone = req.body.phone;
                user.hospitalDetails.website = req.body.website;
                user.hospitalDetails.cmd = req.body.cmd;
                user.hospitalDetails.ceo = req.body.ceo;
                user.hospitalDetails.consultants = req.body.consultants;
                user.hospitalDetails.doctors = req.body.doctors;
                user.hospitalDetails.notifications.unshift(updateMessage);
                user.hospitalDetails.unread_notifications_count++;
                user.hospitalDetails.last_updated = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + " at " + functions.formatTime(date);
                user.hospitalDetails.update_count++;
                user.save(function(err, user) {
                    if(err) {
                        req.flash("Oops! Something isn't quite right.");
                        return res.redirect("back");
                    }
                    return res.redirect('/hospitals/' + user.username + '/dashboard');
                });
                return;
            }
            req.flash("error", "Oops! An error occurred.");
            res.redirect("back");
        }
    });
});

// SHOW(GET): DEPARTMENTS EDIT FORM/HOSPITALS
router.get("/hospitals/:username/departments/edit", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                res.render("hospitals/editDepartments");
                return;
            }
            req.flash("error", "Please create an account.");
            res.redirect("/hospitals/register");
            return;
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// UPDATE(PUT): UPDATE HOSPITAL DEPARTMENTS/HOSPITALS
router.put("/hospitals/:username/departments", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                user.hospitalDetails.departments = [];

                if(typeof req.body.name == "object") {
                    for(var i = 0; i < req.body.name.length; i++) {
                        if(req.body.name[i]) {
                            user.hospitalDetails.departments.push({
                                name: req.body.name[i],
                                staff_count: req.body.staff_count[i],
                                procedures: req.body.procedures[i],
                            });
                        }
                    }   
                } else {
                    user.hospitalDetails.departments.push({
                        name: req.body.name,
                        staff_count: req.body.staff_count,
                        procedures: req.body.procedures,
                    });
                }

                var updateMessage = {
                    date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                    time: functions.formatTime(date),
                    content: "Hi, " + user.hospitalDetails.name + ", You updated your profile. Please let us know if you didn't authorize this.",
                    status: "unread"
                }
                user.hospitalDetails.notifications.unshift(updateMessage);
                user.hospitalDetails.unread_notifications_count++;
                user.hospitalDetails.last_updated = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + " at " + functions.formatTime(date);
                user.hospitalDetails.update_count++;
                user.save(function(err, user) {
                    if(err) {
                        console.log(err);
                        req.flash("error", "Oops! Something isn't quite right.");
                        return res.redirect("back");
                    }
                    req.flash("success", "You edited your profile!");
                    return res.redirect("/hospitals/" + user.username + "/profile");
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

// SHOW(GET): PROCEDURES EDIT FORM/HOSPITALS
router.get("/hospitals/:username/procedures/edit", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                res.render("hospitals/editProcedures");
                return;
            }
            req.flash("error", "Please create an account.");
            res.redirect("/hospitals/register");
            return;
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// UPDATE(PUT): UPDATE PROCEDURES/HOSPITALS
router.put("/hospitals/:username/procedures", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                var updateMessage = {
                    date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                    time: functions.formatTime(date),
                    content: "Hi, " + user.hospitalDetails.name + ", You updated your profile. Please let us know if you didn't authorize this.",
                    status: "unread"
                }

                user.hospitalDetails.procedures = [];
                
                for(var i = 0; i < req.body.procedures.length; i++) {
                    user.hospitalDetails.procedures.push(req.body.procedures[i]);
                }

                user.hospitalDetails.notifications.unshift(updateMessage);
                user.hospitalDetails.unread_notifications_count++;
                user.hospitalDetails.last_updated = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + " at " + functions.formatTime(date);
                user.hospitalDetails.update_count++;
                user.save(function(err, user) {
                    if(err) {
                        req.flash("error", "Oops! Something isn't quite right.");
                        return res.redirect("back");
                    }
                    req.flash("success", "You edited your profile!");
                    return res.redirect("/hospitals/" + user.username + "/profile");
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

// SHOW(GET): FORM TO DEACTIVATE/HOSPITALS
router.get("/hospitals/:username/deactivate", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                return res.render("hospitals/deactivate");
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// REMOVE(DELETE): DEACTIVATE HOSPITAL/HOSPITALS + ADMIN
router.delete("/hospitals/:id", middleware.isUserLoggedIn, function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            req.flash("error", "Oops! An error occurred.");
            return res.redirect("back");
        }
        return res.redirect("/hospitals/register");
    });
});

// SHOW(GET): ACCOUNT SUSPENDED/HOSPITALS
router.get("/hospitals/:username/suspended", middleware.isUserLoggedIn, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                if(user.role === 1) {
                    return res.redirect("/hospitals/" + user.username + "/dashboard");
                }
                return res.render("hospitals/suspended");
            }
            req.flash("error", "Please login or create an account.");
            res.redirect("/login");
            return;
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

module.exports = router;