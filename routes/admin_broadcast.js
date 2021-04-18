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

// NEW(GET): NEW BROADCAST FORM/ADMIN
router.get("/admin/broadcast", middleware.isAdminLoggedIn, middleware.isAdminAuthorized, function(req, res) {
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
                return res.render("admin/broadcast", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
            });
        });
    });
});

// CREATE(POST): SEND NEW BROADCAST TO USERS
router.post("/admin/broadcast", middleware.isAdminLoggedIn, middleware.isAdminAuthorized, function(req, res) {
    if (req.body.recipient === "-1") {
        req.flash("error", "Please select a recipient.");
        return res.redirect("back");
    }

    var recipient = req.body.recipient;
    var broadcastMessage = {
        date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
        time: functions.formatTime(date),
        content: req.body.content,
        status: "unread",
    }

    User.find({ typeOfUser: recipient }, function(err, users) {
        if (err) {
            req.flash("error", "Oops! Something isn't quite right.");
            return res.redirect("back");
        }
        users.forEach(function(user) {
            if (user.typeOfUser === "referrer" && user.role === 1) {
                user.referrerDetails.notifications.unshift(broadcastMessage);
                user.referrerDetails.unread_notifications_count++;
                user.save(function(err, user) {
                    if (err) {
                        req.flash("error", "Oops! Something isn't quite right.")
                        return res.redirect("back");
                    }
                });
            } else if (user.typeOfUser === "hospital" && user.role === 1) {
                user.hospitalDetails.notifications.unshift(broadcastMessage);
                user.hospitalDetails.unread_notifications_count++;
                user.save(function(err, user) {
                    if (err) {
                        req.flash("error", "Oops! Something isn't quite right.")
                        return res.redirect("back");
                    }
                });
            }
        });
        return res.redirect("/admin/dashboard");
    });
});

module.exports = router;