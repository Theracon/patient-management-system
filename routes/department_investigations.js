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

// SHOW(GET): SHOW FORM TO CREATE DEPARTMENTAL INVESTIGATIONS
router.get("/departments/:username/investigations", function(req, res) {
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                return res.render("departments/createInvestigations", { user });
            }

            req.flash("error", "Please login or create an account.");
            return res.redirect("/accounts/departments/login");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// CREATE(POST): CREATE HOSPITAL DEPARTMENTS/HOSPITALS
router.post("/departments/:username/investigations", function(req, res) {
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                var data = req.body;

                if (typeof data === "object") {
                    for (var i = 0; i < data.name.length; i++) {
                        var investigation = { name: data.name[i], price: data.price[i] };
                        user.department_details.investigations.push(investigation);
                    }
                } else {
                    var investigation = { name: data.name, price: data.price };
                    user.department_details.investigations.push(investigation);
                }

                user.role = 1;
                user.save(function(err, user) {
                    return res.redirect("/admin/" + user.username + "/department-created");
                });
                return;
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/accounts/departments/login");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// SHOW(GET): DEPARTMENTS EDIT FORM/HOSPITALS
router.get("/hospitals/:username/departments/edit", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
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
                            return res.render("hospitals/editDepartments", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
                        });
                    });
                });
                return;
            }
            req.flash("error", "Please login or create an account.");
            res.redirect("/hospitals/register");
            return;
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// UPDATE(PUT): UPDATE HOSPITAL DEPARTMENTS/HOSPITALS
router.put("/hospitals/:username/departments", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                date = new Date();

                user.hospitalDetails.departments = [];

                if (typeof req.body.name == "object") {
                    for (var i = 0; i < req.body.name.length; i++) {
                        if (req.body.name[i]) {
                            user.hospitalDetails.departments.push({
                                name: req.body.name[i],
                                staff_count: req.body.staff_count[i],
                                units: req.body.units[i],
                            });
                        }
                    }
                } else {
                    user.hospitalDetails.departments.push({
                        name: req.body.name,
                        staff_count: req.body.staff_count,
                        units: req.body.units,
                    });
                }

                var updateMessage = {
                    date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                    time: functions.formatTime(date),
                    content: "Hi, " + user.hospitalDetails.name + ", You updated your profile. Please let us know if you didn't authorize this.",
                    status: "unread"
                }
                user.hospitalDetails.notifications.unshift(updateMessage);
                user.hospitalDetails.unread_notifications_count++;
                user.hospitalDetails.last_updated = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + " at " + functions.formatTime(date);
                user.hospitalDetails.update_count++;
                user.save(function(err, user) {
                    if (err) {
                        req.flash("error", "Oops! Something isn't quite right.");
                        return res.redirect("back");
                    }
                    req.flash("success", "Profile edited.");
                    return res.redirect("/hospitals/" + user.username + "/profile");
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

module.exports = router;