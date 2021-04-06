var express         = require("express"),
    router          = express.Router(),
    passport        = require("passport"),
    User            = require("../models/user"),
    RemovedUser     = require("../models/removedUser"),
    middleware      = require("../middleware"),
    functions       = require("../functions"),
    date            = new Date(),
    months          = ['January','February','March','April','May','June','July', 'August','September','October','November','December'];

// SHOW(GET): ADMIN DASHBOARD/ADMIN
router.get("/admin/dashboard", middleware.isAdminLoggedIn, middleware.isAdminAuthorized, function(req, res) {
    res.render("admin/dashboard");
});

// SHOW(GET): ALL HOSPITALS/ADMIN
router.get("/admin/hospitals", middleware.isUserLoggedIn, middleware.isAdminAuthorized, function(req, res) {
    User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
        if(err) {
            req.flash("error", "Oops! Something isn't quite right.");
            return res.redirect("back");
        }
        res.render("admin/hospitals", { hospitals: hospitals });
    });
});

// SHOW(GET): SHOW A HOSPITAL's DETAILS/ADMIN
router.get("/admin/hospitals/:username", middleware.isUserLoggedIn, middleware.isAdminAuthorized, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, hospital) {
        if(err) {
            req.flash("error", "Oops! Something isn't quite right.");
            return res.redirect("back");
        }
        res.render("admin/showHospital", { hospital: hospital });
    });
});

// REMOVE(DELETE): DEACTIVATE HOSPITAL/ADMIN
router.delete("/admin/hospitals/:id", middleware.isUserLoggedIn, function(req, res) {
    User.findOne({ typeOfUser: "hospital", _id: req.params.id }, function(err, user) {
        if(err) {
            req.flash("error", "Oops! Something isn't quite right.");
            res.redirect("back");
        } else {
            if(user) {
                if(user.typeOfUser == "referrer") {
                    RemovedUser.create({
                        username: user.username,
                        typeOfUser: referrer,
                        removal_time: functions.formatTime(date),
                        removal_date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                        removal_month: months[date.getMonth()],
                        removal_year: date.getFullYear(),
                        hospitalDetails: null,
                        referrerDetails: {
                            firstname: user.referrerDetails.firstname,
                            lastname: user.referrerDetails.lastname,
                            name: user.referrerDetails.name,
                            institution: String,
                            address: String, 
                            phone: String,
                            bank: String,
                            ac_number: String,
                            ac_name: String,
                            patient_count: Number,
                            commission: Number,
                            patients: [PatientSchema],
                            notifications: [NotificationSchema],
                            unread_notifications_count: Number,
                            last_updated: String,
                            update_count: Number,
                        }
                    });
                } else {

                }

                User.findByIdAndRemove(req.params.id, function(err) {
                    if(err) {
                        req.flash("error", "Oops! Something isn't quite right.");
                        return res.redirect("back");
                    }
                    return res.redirect("/admin/dashboard");
                });
                return;
            }
            req.flash("error", "Oops! Something isn't quite right.");
            return res.redirect("back");
        }
    });
});

// NEW(GET): NEW BROADCAST FORM/ADMIN
router.get("/admin/broadcast", middleware.isAdminLoggedIn, middleware.isAdminAuthorized, function(req, res) {
    res.render("admin/broadcast");
});

// CREATE(POST): SEND BROADCAST TO USERS
router.post("/admin/broadcast", middleware.isAdminLoggedIn, middleware.isAdminAuthorized, function(req, res) {
    if(req.body.recipient === "-1") {
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
        if(err) {
            req.flash("error", "Oops! An error occurred.");
            return res.redirect("back");
        }
        users.forEach(function(user) {
            if(user.typeOfUser === "referrer") {
                user.referrerDetails.notifications.unshift(broadcastMessage);
                user.referrerDetails.unread_notifications_count++;
                user.save(function(err, user) {
                    if(err) {
                        req.flash("Oops! Something isn't quite right.")
                        return res.redirect("back");
                    }
                });
            } else if(user.typeOfUser === "hospital") {
                user.hospitalDetails.notifications.unshift(broadcastMessage);
                user.hospitalDetails.unread_notifications_count++;
                user.save(function(err, user) {
                    if(err) {
                        req.flash("Oops! Something isn't quite right.")
                        return res.redirect("back");
                    }
                });
            }
        });
        return res.redirect("/admin/dashboard");
    });
});

module.exports = router;