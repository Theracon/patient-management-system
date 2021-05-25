var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    Patient = require("../models/patient"),
    hospitalCount = '',
    referrerCount = '',
    patientCount = '',
    RemovedUser = require("../models/removedUser"),
    middleware = require("../middleware"),
    functions = require("../functions"),
    date = new Date(),
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// SHOW(GET): ALL HOSPITALS/ADMIN
router.get("/admin/hospitals", middleware.isAdminLoggedIn, middleware.isAdminAuthorized, function(req, res) {
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
                return res.render("admin/hospitals", { hospitals: hospitals, hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
            });
        });
    });
});

// SHOW(GET): HOSPITAL DETAILS/ADMIN
router.get("/admin/hospitals/:username", middleware.isAdminLoggedIn, middleware.isAdminAuthorized, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, hospital) {
        if (err) {
            req.flash("error", "Oops! Something isn't quite right.");
            return res.redirect("back");
        }
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
                    return res.render("admin/showHospital", { hospital: hospital, hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
                });
            });
        });
    });
});

// UPDATE(PUT): ACTIVATE HOSPITAL/ADMIN
router.put("/admin/hospitals/:username/activate", middleware.isAdminLoggedIn, middleware.isAdminAuthorized, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (err) {
            req.flash("error", "Oops! Something isn't quite right.");
            res.redirect("back");
        }
        if (user) {
            date = new Date();
            // Change hospital role
            user.role = 1;

            // Send notification to hospital
            var activationMessage = {
                date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                time: functions.formatTime(date),
                content: `Hi ${user.hospitalDetails.name}, your profile is now active!`,
                status: "unread"
            }

            // Send notification to hospital
            user.hospitalDetails.notifications.unshift(activationMessage);

            // Update hospital's notifications count
            user.hospitalDetails.unread_notifications_count++;

            // Save hospital data to database
            user.save(function(err, user) {
                if (err) {
                    req.flash("error", "Oops! Something isn't quite right.");
                    res.redirect("back");
                }
                return res.redirect("/admin/hospitals/" + user.username);
            });
        }
    });
});

// UPDATE(PUT): SUSPEND HOSPITAL/ADMIN
router.put("/admin/hospitals/:username/suspend", middleware.isAdminLoggedIn, middleware.isAdminAuthorized, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (err) {
            req.flash("error", "Oops! Something isn't quite right.");
            res.redirect("back");
        }
        if (user) {
            user.role = -1;
            user.save(function(err, user) {
                if (err) {
                    req.flash("error", "Oops! Something isn't quite right.");
                    res.redirect("back");
                }
                return res.redirect("/admin/hospitals/" + user.username);
            });
        }
    });
});

// REMOVE(DELETE): DELETE HOSPITAL/ADMIN
router.delete("/admin/hospitals/:id", middleware.isAdminLoggedIn, middleware.isAdminAuthorized, function(req, res) {
    User.findOne({ typeOfUser: "hospital", _id: req.params.id }, function(err, user) {
        if (err) {
            req.flash("error", "Oops! Something isn't quite right.");
            res.redirect("back");
        }
        if (user) {
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
                if (err) {
                    req.flash("error", "Oops! Something isn't quite right.");
                    return res.redirect("back");
                }
                return res.redirect("/admin/hospitals");
            });
            return;
        }
        req.flash("error", "Oops! Something isn't quite right.");
        return res.redirect("back");
    });
});

module.exports = router;