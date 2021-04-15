var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    middleware = require("../middleware");

// SHOW(GET): NOTIFICATIONS/REFERRERS
router.get("/referrers/:username/notifications", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                return res.render("referrers/notifications");
            }
            req.flash("error", "Please login or create an account.");
            res.redirect("/login");
            return;
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// SHOW(GET): SHOW A NOTIFICATION/REFERRERS
router.get("/referrers/:username/notifications/:id", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    User.findOne({ typeOfUser: "referrer", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                var notify;

                // Update referrer's unread notifications count and update status to "read"
                user.referrerDetails.notifications.forEach(function(notification) {
                    if (notification._id == req.params.id && notification.status == "unread") {
                        if (user.referrerDetails.unread_notifications_count > 0) {
                            user.referrerDetails.unread_notifications_count--;
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
                    return res.render("referrers/showNotification", { notify });
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