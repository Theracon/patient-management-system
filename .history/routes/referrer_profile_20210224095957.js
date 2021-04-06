var express                 = require("express"),
    router                  = express.Router(),
    User                    = require("../models/user"),
    Patient                 = require("../models/patient"),
    uniqid                  = require("uniqid"),
    middleware              = require("../middleware"),
    functions               = require("../functions"),
    salt                    = Math.floor(Math.random() * 100),
    randomID                = uniqid.time("", salt).toUpperCase(),
    hospitals               = ["Mayfield Specialist Hospital", "Nizamiye Hospital", "e-Clinic & Diagnostics"],
    date                    = new Date(),
    months                  =   [ 'January','February','March','April','May','June','July',
                                'August','September','October','November','December',
                                ];

// SHOW(GET): REFERRER PROFILE CREATION FORM/REFERRERS
router.get('/referrers/:username/update', middleware.isUserLoggedIn, function (req, res) {
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                res.render("referrers/details");
                return;
            }
            req.flash("error", "Please create an account.");
            res.redirect("/");
            return;
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// CREATE(POST): CREATE REFERRER PROFILE/REFERRERS
router.post('/referrers/:username/update', middleware.isUserLoggedIn, function (req, res) {
    // Find referrer in database, then update referrer info
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
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
                    content: "Hi, Doctor " + user.referrerDetails.firstname + ", we're pleased to have you on PatientRef. Feel free to use the FAQs section if you need clarification or reach us by phone or email.",
                    status: "unread"
                }
                // Push welcome message into referrer notifications array
                user.referrerDetails.notifications.push(welcomeMessage);
                // Update referrer's unread notifications count
                user.referrerDetails.unread_notifications_count = 1;
                // Save updated user
                user.save(function(err, savedUser) {
                    req.flash("success", "Welcome to your dashboard.");
                    return res.redirect('/referrers/' + savedUser.username + '/dashboard');
                });
                return;
            }
            req.flash("error", "Oops! An error occurred while updating profile.");
            res.redirect("back");
        }
    });
});

// SHOW(GET): REFERRER PROFILE/REFERRERS
router.get('/referrers/:username/profile', middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function (req, res) {
    // Find referrer from database
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                res.render("referrers/profile");
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

// SHOW(GET): REFERRER PROFILE EDIT FORM/REFERRERS
router.get("/referrers/:username/profile/edit", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    // Find user from db
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                res.render("referrers/editProfile");
                return;
            }
            req.flash("error", "Please create an account.");
            res.redirect("/");
            return;
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// UPDATE(PUT): UPDATE REFERRER PROFILE/REFERRERS
router.put('/referrers/:username/update', middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function (req, res) {
    // Find referrer in db 
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
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

                var updateMessage = {
                    date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                    time: functions.formatTime(date),
                    content: "Hi, " + user.hospitalDetails.name + ", You updated your profile. Please let us know if you didn't authorize this.",
                    status: "unread"
                }
                // Save updated user
                user.save(function(err, user) {
                    return res.redirect("/referrers/" + user.username + "/profile");
                });
                return;
            }
            req.flash("error", "Please create an account.");
            res.redirect("/");
            return;
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// SHOW(GET): FORM TO DEACTIVATE REFERRER/REFERRERS
router.get("/referrers/:username/deactivate", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
        if(!err) {
            if(user) {
                return res.render("referrers/deactivate");
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// DELETE(DELETE): DEACTIVATE REFERRER/REFERRERS + ADMIN
router.delete("/referrers/:id", middleware.isUserLoggedIn, function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            req.flash("error", "Oops! An error occurred.");
            return res.redirect("back");
        }
        return res.redirect("/");
    });
});

module.exports = router;