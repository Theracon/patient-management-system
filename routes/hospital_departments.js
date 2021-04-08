var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    middleware = require("../middleware"),
    functions = require("../functions"),
    date = new Date(),
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// SHOW(GET): SHOW FORM TO CREATE HOSPITAL DEPARTMENTS/HOSPITALS
router.get("/hospitals/:username/departments", middleware.isUserLoggedIn, middleware.isHospitalProfileCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                return res.render("hospitals/createDepartments");
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// CREATE(POST): CREATE HOSPITAL DEPARTMENTS/HOSPITALS
router.post("/hospitals/:username/departments", middleware.isUserLoggedIn, middleware.isHospitalProfileCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                if (typeof req.body.name == "object") {
                    for (var i = 0; i < req.body.name.length; i++) {
                        user.hospitalDetails.departments.push({
                            name: req.body.name[i],
                            staff_count: req.body.staff_count[i],
                            procedures: req.body.procedures[i],
                        });
                    }
                } else {
                    user.hospitalDetails.departments.push({
                        name: req.body.name,
                        staff_count: req.body.staff_count,
                        procedures: req.body.procedures,
                    });
                }

                user.role = 0.75;
                user.save(function(err, user) {
                    req.flash("success", "You created your profile!");
                    return res.redirect("/hospitals/" + user.username + "/pending");
                });
                return;
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// SHOW(GET): DEPARTMENTS EDIT FORM/HOSPITALS
router.get("/hospitals/:username/departments/edit", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                res.render("hospitals/editDepartments");
                return;
            }
            req.flash("error", "Please create an account.");
            res.redirect("/hospitals/register");
            return;
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// UPDATE(PUT): UPDATE HOSPITAL DEPARTMENTS/HOSPITALS
router.put("/hospitals/:username/departments", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                user.hospitalDetails.departments = [];

                if (typeof req.body.name == "object") {
                    for (var i = 0; i < req.body.name.length; i++) {
                        if (req.body.name[i]) {
                            user.hospitalDetails.departments.push({
                                name: req.body.name[i],
                                staff_count: req.body.staff_count[i],
                                procedures: req.body.procedures[i],
                            });
                        }
                    }
                } else {
                    user.hospitalDetails.departments.push({
                        name: req.body.name,
                        staff_count: req.body.staff_count,
                        procedures: req.body.procedures,
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
                        console.log(err);
                        req.flash("error", "Oops! Something isn't quite right.");
                        return res.redirect("back");
                    }
                    req.flash("success", "You edited your profile!");
                    return res.redirect("/hospitals/" + user.username + "/profile");
                });
                return;
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

module.exports = router;