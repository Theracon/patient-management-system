var express                 = require("express"),
    router                  = express.Router(),
    User                    = require("../models/user"),
    middleware              = require("../middleware");

// SHOW(GET): DASHBOARD/REFERRERS
router.get('/referrers/:id/dashboard', middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function (req, res) {
    User.findOne({ typeOfUser: "referrer", _id: req.params.id }, function(err, user) {
        if(!err) {
            if(user) {
                return res.render("referrers/dashboard");
            }
            req.flash("error", "Please login or create an account.");
            res.redirect("/login");
            return;
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// SHOW(GET): CONTACT TEMPLATE/REFERRERS
router.get('/referrers/:id/contact', middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function (req, res) {
    User.findOne({ typeOfUser: "referrer", _id: req.params.id }, function(err, user) {
        if(!err) {
            if(user) {
                return res.render("referrers/contact");
            }
            req.flash("error", "Please login or create an account.");
            res.redirect("/login");
            return;
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// SHOW(GET): NOTIFICATIONS/REFERRERS
router.get("/referrers/:id/notifications", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    User.findOne({ typeOfUser: "referrer", _id: req.params.id }, function(err, user) {
        if(!err) {
            if(user) {
                return res.render("referrers/notifications");
            }
            req.flash("error", "Please login or create an account.");
            res.redirect("/login");
            return;
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// SHOW(GET): OPEN NOTIFICATION/REFERRERS
router.get("/referrers/:id/notifications/:id1", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    User.findOne({ typeOfUser: "referrer", _id: req.params.id }, function(err, user) {
        if(!err) {
            if(user) {
                // Update referrer's unread notifications count
                if(user.referrerDetails.unread_notifications_count > 0) {
                    user.referrerDetails.unread_notifications_count--;
                }
                // Make a copy of notification
                var notification = user.referrerDetails.notifications.find(function(notification) {
                    return notification._id === req.params.id1;
                });
                console.log(notification);

                if(notification.status === "unread") {
                    // Change notification's status to "read"
                    notification.status = "read";

                    // Find index of notification
                    var index = user.referrerDetails.notifications.findIndex(function(el) {
                        return el._id === req.params.id1;
                    });
                    console.log(index);

                    // Delete notification from notifications array
                    user.referrerDetails.notifications.splice(index, 1);

                    // Insert notification into its former index in notifications array
                    user.referrerDetails.notifications.splice(index, 0, notification);

                    // Save updated user
                    user.save(function(err, user) {
                        if(err) {
                            req.flash("error", "Oops! An error occurred.");
                            return res.redirect("back");
                        }
                        return res.render("referrers/showNotification", { notification });
                    });
                // } else {
                //    return res.render("referrers/showNotification", { notification });
                }
                return;
            }
            req.flash("error", "Please login or create an account.");
            res.redirect("/login");
            return;
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

module.exports = router;