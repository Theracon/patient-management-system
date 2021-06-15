var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    functions = require("../functions"),
    date = new Date();

// SHOW(GET): FORM TO CREATE DEPARTMENTAL PROFILE
router.get("/departments/:username/details", function(req, res) {
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                return res.render("departments/createProfile", { user });
            }

            req.flash("error", "Please login or create an account.");
            return res.redirect("/accounts/departments/login");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// CREATE(POST): CREATE DEPARTMENTAL PROFILE
router.post('/departments/:username/update', function(req, res) {
    // Find hospital in database, then update hospital info
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                date = new Date();

                // Create admin message
                var welcomeMessage = {
                    date: date.toLocaleString("en-NG"),
                    time: functions.formatTime(date),
                    content: "Hello, there! Welcome to My Clinic.",
                    status: "unread"
                }

                user.department_details = {
                    name: req.body.name,
                    hod: req.body.hod
                };

                // Push welcome message into department notifications array
                user.notifications.push(welcomeMessage);

                // Update department unread notifications count
                user.unread_notifications_count = 1;

                // Save updated user
                user.save(function(err, savedUser) {
                    return res.redirect('/departments/' + savedUser.username + '/investigations');
                });
                return;
            }
            req.flash("error", "Oops! Something isn't quite right.")
            res.redirect("back");
        }
    });
});

// SHOW(GET): SHOW PROFILE
router.get('/departments/:username/profile', function(req, res) {
    // Find referrer from database
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                return res.render("departments/profile", { user });
            }

            req.flash("error", "Please login or create an account.");
            return res.redirect("/accounts/departments/login");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// SHOW(GET): PROFILE EDIT FORM/HOSPITALS
router.get("/departments/:username/profile/edit", function(req, res) {
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                return res.render("departments/editProfile", { user });
            }

            req.flash("error", "Please login or create an account.");
            return res.redirect("/accounts/departments/login");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// UPDATE(PUT): UPDATE PROFILE/HOSPITALS
router.put("/hospitals/:username/update", function(req, res) {
    // Find hospital in database, then update hospital info
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                date = new Date();

                var updateMessage = {
                    date: date.toLocaleString("en-NG"),
                    content: "Hi, " + user.hospitalDetails.name + ", You updated your profile. Please let us know if you didn't authorize this.",
                    status: "unread"
                }

                user.department_details.name = req.body.name;
                user.department_details.hod = req.body.hod;
                user.notifications.unshift(updateMessage);
                user.unread_notifications_count++;
                user.last_updated = date.toLocaleString("en-NG");
                user.save(function(err, user) {
                    if (err) {
                        req.flash("Oops! Something isn't quite right.");
                        return res.redirect("back");
                    }
                    return res.redirect('/departments/' + user.username + '/dashboard');
                });
                return;
            }
            req.flash("error", "Oops! Something isn't quite right.")
            res.redirect("back");
        }
    });
});

module.exports = router;