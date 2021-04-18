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

// SHOW(GET): ALL REFERRERS/ADMIN
router.get("/admin/referrers", middleware.isAdminLoggedIn, middleware.isAdminAuthorized, function(req, res) {
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
                return res.render("admin/referrers", { referrers: referrers, hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
            });
        });
    });
});

// SHOW(GET): SHOW A REFERRER's DETAILS/ADMIN
router.get("/admin/referrers/:username", middleware.isAdminLoggedIn, middleware.isAdminAuthorized, function(req, res) {
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, referrer) {
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
                    return res.render("admin/showReferrer", { referrer: referrer, hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
                });
            });
        });
    });
});

// REMOVE(DELETE): DEACTIVATE REFERRER/ADMIN
router.delete("/admin/referrers/:id", middleware.isAdminLoggedIn, middleware.isAdminAuthorized, function(req, res) {
    User.findOne({ typeOfUser: "referrer", _id: req.params.id }, function(err, user) {
        if (err) {
            req.flash("error", "Oops! Something isn't quite right.");
            res.redirect("back");
        } else {
            if (user) {
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
                    if (err) {
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

module.exports = router;