var express                 = require("express"),
    router                  = express.Router(),
    User                    = require("../models/user"),
    middleware              = require("../middleware");


// SHOW(GET): ACCOUNT PENDING ACTIVATION/REFERRERS
router.get("/referrers/:username/pending", middleware.isUserLoggedIn, function(req, res) {
    User.findOne({ typeOfUser: "referrer", username: req.params.id }, function(err, user) {
        if(!err) {
            if(user) {
                if(user.role === 0) {
                    return res.render("referrers/pending");
                }
                return res.redirect("/referrers/" + user._id + "/dashboard");                
            }
            req.flash("error", "Please login or create an account.");
            res.redirect("/login");
            return;
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

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

// SHOW(GET): SHOW A NOTIFICATION/REFERRERS
router.get("/referrers/:id/notifications/:id1", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    User.findOne({ typeOfUser: "referrer", _id: req.params.id }, function(err, user) {
        if(!err) {
            if(user) {
                var notify;
                // Update referrer's unread notifications count
                if(user.referrerDetails.unread_notifications_count > 0) {
                    user.referrerDetails.unread_notifications_count--;
                }
                user.referrerDetails.notifications.forEach(function(notification) {
                    if(notification._id == req.params.id1) {
                        notification.status = "read";
                        notify = notification;
                    }
                });
                // Save updated user
                user.save(function(err, user) {
                    if(err) {
                        req.flash("error", "Oops! An error occurred.");
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
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

module.exports = router;