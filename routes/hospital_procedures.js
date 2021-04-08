var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    middleware = require("../middleware"),
    functions = require("../functions"),
    date = new Date(),
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// SHOW(GET): SHOW FORM TO CREATE HOSPITAL PROCEDURES/HOSPITALS
router.get("/hospitals/:username/procedures", middleware.isUserLoggedIn, middleware.isHospitalProfileCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                return res.render("hospitals/createProcedures");
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// CREATE(POST): HOSPITAL PROCEDURES/HOSPITALS
router.post("/hospitals/:username/procedures", middleware.isUserLoggedIn, middleware.isHospitalProfileCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                for (var i = 0; i < req.body.procedures.length; i++) {
                    user.hospitalDetails.procedures.push(req.body.procedures[i]);
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

// SHOW(GET): PROCEDURES EDIT FORM/HOSPITALS
router.get("/hospitals/:username/procedures/edit", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                res.render("hospitals/editProcedures");
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

// UPDATE(PUT): UPDATE PROCEDURES/HOSPITALS
router.put("/hospitals/:username/procedures", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                var updateMessage = {
                    date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                    time: functions.formatTime(date),
                    content: "Hi, " + user.hospitalDetails.name + ", You updated your profile. Please let us know if you didn't authorize this.",
                    status: "unread"
                }

                user.hospitalDetails.procedures = [];

                for (var i = 0; i < req.body.procedures.length; i++) {
                    user.hospitalDetails.procedures.push(req.body.procedures[i]);
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