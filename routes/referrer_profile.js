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

// SHOW(GET): REFERRER PROFILE CREATION FORM/REFERRERS
router.get('/referrers/:username/update', middleware.isUserLoggedIn, function(req, res) {
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
                            return res.render("referrers/details", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
                        });
                    });
                });
                return;
            }
            req.flash("error", "Please login or create an account.");
            res.redirect("/");
            return;
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// CREATE(POST): CREATE REFERRER PROFILE/REFERRERS
router.post('/referrers/:username/update', middleware.isUserLoggedIn, function(req, res) {
    // Find referrer in database, then update referrer info
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                user.role = 0;
                user.referrerDetails = {
                        title: req.body.title,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        name: req.body.firstname + " " + req.body.lastname,
                        institution: req.body.institution,
                        address: req.body.address,
                        phone: req.body.phone,
                        bank: req.body.bank,
                        ac_number: req.body.ac_number,
                        ac_name: req.body.ac_name,
                        patient_count: 0,
                        commission: 0,
                        update_count: 0,
                    }
                    // Create admin message
                var welcomeMessage = {
                        date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                        time: functions.formatTime(date),
                        content: "Hi there! Welcome to Fastclinic. Feel free to visit the FAQs page if you need any clarifications or visit the contact page to reach us by phone or email.",
                        status: "unread"
                    }
                    // Push welcome message into referrer notifications array
                user.referrerDetails.notifications.push(welcomeMessage);
                // Update referrer's unread notifications count
                user.referrerDetails.unread_notifications_count = 1;
                // Save updated user
                user.save(function(err, savedUser) {
                    return res.redirect('/referrers/' + savedUser.username + '/dashboard');
                });
                return;
            }
            req.flash("error", "Oops! Something isn't quite right.")
            res.redirect("back");
        }
    });
});

// SHOW(GET): REFERRER PROFILE/REFERRERS
router.get('/referrers/:username/profile', middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    // Find referrer from database
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
                            return res.render("referrers/profile", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
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

// SHOW(GET): REFERRER PROFILE EDIT FORM/REFERRERS
router.get("/referrers/:username/profile/edit", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    // Find user from db
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
                            return res.render("referrers/editProfile", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
                        });
                    });
                });
                return;
            }
            req.flash("error", "Please login or create an account.");
            res.redirect("/");
            return;
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// UPDATE(PUT): UPDATE REFERRER PROFILE/REFERRERS
router.put('/referrers/:username/update', middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    // Find referrer in db 
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                var updateMessage = {
                        date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                        time: functions.formatTime(date),
                        content: "Hi " + user.referrerDetails.name + ", You updated your profile. Please let us know if you didn't authorize this.",
                        status: "unread"
                    }
                    // Update referrer details
                user.referrerDetails.firstname = req.body.firstname;
                user.referrerDetails.lastname = req.body.lastname;
                user.referrerDetails.name = req.body.firstname + ' ' + req.body.lastname;
                user.referrerDetails.institution = req.body.institution;
                user.referrerDetails.address = req.body.address;
                user.referrerDetails.phone = req.body.phone;
                user.referrerDetails.ac_number = req.body.ac_number;
                user.referrerDetails.ac_name = req.body.ac_name;
                user.referrerDetails.bank = req.body.bank;
                user.referrerDetails.last_updated = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + " at " + functions.formatTime(date);
                user.referrerDetails.update_count++;
                user.referrerDetails.notifications.unshift(updateMessage);
                user.referrerDetails.unread_notifications_count++;
                // Save updated user
                user.save(function(err, user) {
                    return res.redirect("/referrers/" + user.username + "/profile");
                });
                return;
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

module.exports = router;