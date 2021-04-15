var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    middleware = require("../middleware");

// SHOW(GET): NOTIFICATIONS/HOSPITALS
router.get("/hospitals/:username/notifications", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                return res.render("hospitals/notifications");
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// SHOW(GET): SHOW A NOTIFICATION/HOSPITALS
router.get("/hospitals/:username/notifications/:id", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                var notify;

                // Update hospital's unread notifications count and update status to "read"
                user.hospitalDetails.notifications.forEach(function(notification) {
                    if (notification._id == req.params.id && notification.status == "unread") {
                        if (user.hospitalDetails.unread_notifications_count > 0) {
                            user.hospitalDetails.unread_notifications_count--;
                        }
                        notification.status = "read";
                        notify = notification;
                    } else if (notification._id == req.params.id && notification.status == "read") {
                        notify = notification;
                    } else {
                        notify = notification;
                    }
                });
                // Save updated user
                user.save(function(err, user) {
                    if (err) {
                        req.flash("error", "Oops! Something isn't quite right.")
                        return res.redirect("back");
                    }
                    return res.render("hospitals/showNotification", { notify });
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