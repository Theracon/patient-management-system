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
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    hospitalType = ["Teaching Hospital", "Specialist Hospital", "General Hospital", "Primary Healthcare Centre", "Diagnostic Centre", "Other"];

// SHOW(GET): FORM TO CREATE PROFILE/HOSPITALS
router.get("/hospitals/:username/details", middleware.isUserLoggedIn, function(req, res) {
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
                            return res.render("hospitals/createProfile", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
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

// CREATE(POST): CREATE PROFILE/HOSPITALS
router.post('/hospitals/:username/update', middleware.isUserLoggedIn, function(req, res) {

    var institution_type = req.body.institution_type;

    if (institution_type === "-1") {
        req.flash("error", "Please select institution type.");
        document.getElementById("institution_type").focus();
        res.redirect("back");
    } else {
        // Find hospital in database, then update hospital info
        User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
            if (!err) {
                if (user) {
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
                            content: "Hi there! Welcome to Fastclinic. Feel free to visit the FAQs page if you need any clarifications or visit the contact page to reach us by phone or email.",
                            status: "unread"
                        }
                        // Push welcome message into hospital notifications array
                    user.hospitalDetails.notifications.push(welcomeMessage);
                    // Update hospital's unread notifications count
                    user.hospitalDetails.unread_notifications_count = 1;
                    // Save updated user
                    user.save(function(err, savedUser) {
                        return res.redirect('/hospitals/' + savedUser.username + '/departments');
                    })
                    return;
                }
                req.flash("error", "Oops! Something isn't quite right.")
                res.redirect("back");
            }
        });
    }
});

// SHOW(GET): PROFILE/HOSPITALS
router.get('/hospitals/:username/profile', middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    // Find referrer from database
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
                            return res.render("hospitals/profile", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
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

// SHOW(GET): PROFILE EDIT FORM/HOSPITALS
router.get("/hospitals/:username/profile/edit", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
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
                            return res.render("hospitals/editProfile", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
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

// UPDATE(PUT): UPDATE PROFILE/HOSPITALS
router.put("/hospitals/:username/update", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    // Find hospital in database, then update hospital info
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                var institutionType;
                var updateMessage = {
                    date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                    time: functions.formatTime(date),
                    content: "Hi, " + user.hospitalDetails.name + ", You updated your profile. Please let us know if you didn't authorize this.",
                    status: "unread"
                }

                if (req.body.institution_type[1]) {
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
                    if (err) {
                        req.flash("Oops! Something isn't quite right.");
                        return res.redirect("back");
                    }
                    return res.redirect('/hospitals/' + user.username + '/dashboard');
                });
                return;
            }
            req.flash("error", "Oops! Something isn't quite right.")
            res.redirect("back");
        }
    });
});

module.exports = router;