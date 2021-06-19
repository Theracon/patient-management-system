var express = require("express"),
    router = express.Router(),
    User = require("../models/user");

// SHOW(GET): SHOW DEPARTMENT NOTIFICATIONS
router.get("/departments/:username/notifications", function(req, res) {
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                return res.render("departments/notifications", { user });
            }
            req.flash("error", "Please login.");
            return res.redirect("/accounts/departments/login");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// SHOW(GET): SHOW NOTIFICATION INFO
router.get("/departments/:username/notifications/:id", function(req, res) {
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                var notificationToDisplay = {};

                // Update department's unread notifications count and update notification status to "read"
                user.notifications.forEach(function(notification) {
                    if (notification._id == req.params.id) {
                        if (notification.status == "unread") {
                            notification.status = "read";
                            user.unread_notifications_count--;
                        }
                        notificationToDisplay = notification;
                    }
                });

                // Save updated user
                user.save(function(err, user) {
                    if (err) {
                        req.flash("error", "Oops! Something isn't quite right.")
                        return res.redirect("back");
                    }
                    return res.render("departments/showNotification", { user, notification: notificationToDisplay });
                });
                return;
            }
            req.flash("error", "Please login.");
            return res.redirect("/accounts/departments/login");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

module.exports = router;