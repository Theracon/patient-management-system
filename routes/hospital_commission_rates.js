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

// SHOW(GET): SHOW FORM TO CREATE HOSPITAL COMMISSION RATES/HOSPITALS
router.get("/hospitals/:username/commissions/create", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
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
                            return res.render("hospitals/createCommissionRates", { hospitalCount, referrerCount, patientCount });
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

// SHOW(GET): SHOW FORM TO EDIT HOSPITAL COMMISSION RATES/HOSPITALS
router.get("/hospitals/:username/commissions/edit", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
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
                            return res.render("hospitals/editCommissionRates", { hospitalCount, referrerCount, patientCount });
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

// CREATE(POST): CREATE HOSPITAL COMMISSION RATES/HOSPITALS
router.post("/hospitals/:username/commissions", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                // Create hospital commission rates
                user.hospitalDetails.commission_rates = {
                    min_amount_rate: parseFloat(req.body.min_amount_rate),
                    low_amount_rate: parseFloat(req.body.low_amount_rate),
                    mid_amount_rate: parseFloat(req.body.mid_amount_rate),
                    high_amount_rate: parseFloat(req.body.high_amount_rate),
                    max_amount_rate: parseFloat(req.body.max_amount_rate),
                }

                // Calculate hospital's average commission rate
                user.hospitalDetails.average_commission_rate =
                    (
                        user.hospitalDetails.commission_rates.min_amount_rate +
                        user.hospitalDetails.commission_rates.low_amount_rate +
                        user.hospitalDetails.commission_rates.mid_amount_rate +
                        user.hospitalDetails.commission_rates.high_amount_rate +
                        user.hospitalDetails.commission_rates.max_amount_rate
                    ) / 5;

                // Mark hospital's profile as complete
                user.hospitalDetails.profile_complete = true;

                // Create a notification
                var updateMessage = {
                    date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                    time: functions.formatTime(date),
                    content: "Hi, " + user.hospitalDetails.name + ", You updated your commission rates. Please let us know if you didn't authorize this.",
                    status: "unread"
                }

                // Add notification to hospital's notifications list
                user.hospitalDetails.notifications.unshift(updateMessage);

                // Update notifications count
                user.hospitalDetails.unread_notifications_count++;

                // Update time of last profile update
                user.hospitalDetails.last_updated = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + " at " + functions.formatTime(date);

                // Update number of profile updates
                user.hospitalDetails.update_count++;

                // Save user data
                user.save(function(err, user) {
                    console.log(user.hospitalDetails.commission_rates);
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
                                return res.redirect("/hospitals/" + user.username + "/profile");
                            });
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

// UPDATE(PUT): UPDATE HOSPITAL COMMISSION RATES/HOSPITALS
router.put("/hospitals/:username/commissions", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                // Create hospital commission rates
                user.hospitalDetails.commission_rates = {
                    min_amount_rate: parseFloat(req.body.min_amount_rate),
                    low_amount_rate: parseFloat(req.body.low_amount_rate),
                    mid_amount_rate: parseFloat(req.body.mid_amount_rate),
                    high_amount_rate: parseFloat(req.body.high_amount_rate),
                    max_amount_rate: parseFloat(req.body.max_amount_rate),
                }

                // Calculate hospital's average commission rate
                user.hospitalDetails.average_commission_rate =
                    (
                        user.hospitalDetails.commission_rates.min_amount_rate +
                        user.hospitalDetails.commission_rates.low_amount_rate +
                        user.hospitalDetails.commission_rates.mid_amount_rate +
                        user.hospitalDetails.commission_rates.high_amount_rate +
                        user.hospitalDetails.commission_rates.max_amount_rate
                    ) / 5;

                // Create a notification
                var updateMessage = {
                    date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                    time: functions.formatTime(date),
                    content: "Hi, " + user.hospitalDetails.name + ", You updated your commission rates. Please let us know if you didn't authorize this.",
                    status: "unread"
                }

                // Add notification to hospital's notifications list
                user.hospitalDetails.notifications.unshift(updateMessage);

                // Update notifications count
                user.hospitalDetails.unread_notifications_count++;

                // Update time of last profile update
                user.hospitalDetails.last_updated = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + " at " + functions.formatTime(date);

                // Update number of profile updates
                user.hospitalDetails.update_count++;

                // Save user data
                user.save(function(err, user) {
                    console.log(user.hospitalDetails.commission_rates);
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
                                return res.redirect("/hospitals/" + user.username + "/profile");
                            });
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

module.exports = router;