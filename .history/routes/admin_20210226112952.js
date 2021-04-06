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
router.get("/admin/hospitals", middleware.isAdminLoggedIn, middleware.isAdminAuthorized, function(req, res) {
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
router.delete("/admin/hospitals/:id", middleware.isUserLoggedIn, middleware.isAdminAuthorized, function(req, res) {
    User.findOne({ typeOfUser: "hospital", _id: req.params.id }, function(err, user) {
        if(err) {
            req.flash("error", "Oops! Something isn't quite right.");
            res.redirect("back");
        } else {
            if(user) {
                RemovedUser.create({
                    username: user.username,
                    typeOfUser: user.typeOfUser,
                    removal_time: functions.formatTime(date),
                    removal_date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                    removal_month: months[date.getMonth()],
                    removal_year: date.getFullYear(),
                    referrerDetails: null,
                    hospitalDetails: {
                        institution_type: user.hospitalDetails.institution_type,
                        name: user.hospitalDetails.name,
                        address: user.hospitalDetails.address,
                        email: user.hospitalDetails.email,
                        phone: user.hospitalDetails.phone,
                        website: user.hospitalDetails.website,
                        cmd: user.hospitalDetails.cmd,
                        ceo: user.hospitalDetails.ceo,
                        consultants: user.hospitalDetails.consultants,
                        doctors: user.hospitalDetails.doctors,
                        departments: user.hospitalDetails.departments,
                        patients: user.hospitalDetails.patients,
                        notifications: user.hospitalDetails.notifications,
                        unread_notifications_count: user.hospitalDetails.unread_notifications_count,
                        last_updated: user.hospitalDetails.last_updated,
                        update_count: user.hospitalDetails.update_count,
                    }
                });

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

// SHOW(GET): ALL REFERRERS/ADMIN
router.get("/admin/referrers", middleware.isUserLoggedIn, middleware.isAdminAuthorized, function(req, res) {
    User.find({ typeOfUser: "referrer" }, function(err, referrers) {
        if(err) {
            req.flash("error", "Oops! Something isn't quite right.");
            return res.redirect("back");
        }
        res.render("admin/referrers", { referrers: referrers });
    });
});

// SHOW(GET): SHOW A REFERRER's DETAILS/ADMIN
router.get("/admin/referrers/:username", middleware.isUserLoggedIn, middleware.isAdminAuthorized, function(req, res) {
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, referrer) {
        if(err) {
            req.flash("error", "Oops! Something isn't quite right.");
            return res.redirect("back");
        }
        res.render("admin/showReferrer", { referrer: referrer });
    });
});

// REMOVE(DELETE): DEACTIVATE REFERRER/ADMIN
router.delete("/admin/referrers/:id", middleware.isUserLoggedIn, middleware.isAdminAuthorized, function(req, res) {
    User.findOne({ typeOfUser: "referrer", _id: req.params.id }, function(err, user) {
        if(err) {
            req.flash("error", "Oops! Something isn't quite right.");
            res.redirect("back");
        } else {
            if(user) {
                RemovedUser.create({
                    username: user.username,
                    typeOfUser: user.typeOfUser,
                    removal_time: functions.formatTime(date),
                    removal_date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                    removal_month: months[date.getMonth()],
                    removal_year: date.getFullYear(),
                    hospitalDetails: null,
                    referrerDetails: {
                        firstname: user.referrerDetails.firstname,
                        lastname: user.referrerDetails.lastname,
                        name: user.referrerDetails.name,
                        institution: user.referrerDetails.institution,
                        address: user.referrerDetails.address, 
                        phone: user.referrerDetails.phone,
                        bank: user.referrerDetails.bank,
                        ac_number: user.referrerDetails.ac_number,
                        ac_name: user.referrerDetails.ac_name,
                        patient_count: user.referrerDetails.patient_count,
                        commission: user.referrerDetails.commission,
                        patients: user.referrerDetails.patients,
                        notifications: user.referrerDetails.notifications,
                        unread_notifications_count: user.referrerDetails.unread_notifications_count,
                        last_updated: user.referrerDetails.last_updated,
                        update_count: user.referrerDetails.update_count,
                    }
                });

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
            if(user.typeOfUser === "referrer" && user.role === 1) {
                user.referrerDetails.notifications.unshift(broadcastMessage);
                user.referrerDetails.unread_notifications_count++;
                user.save(function(err, user) {
                    if(err) {
                        req.flash("Oops! Something isn't quite right.")
                        return res.redirect("back");
                    }
                });
            } else if(user.typeOfUser === "hospital" && user.role === 1) {
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

// LOGOUT(GET): USER LOGOUT/ADMIN
router.get('/admin/logout', function (req, res) {
    req.logout();
    req.flash("success", "Logged out.");
    res.redirect('/admin/login');
});

module.exports = router;