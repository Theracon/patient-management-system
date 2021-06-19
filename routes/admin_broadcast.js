var express = require("express"),
    router = express.Router(),
    User = require("../models/user");

// NEW(GET): FORM TO SEND A NEW BROADCAST MESSAGE
router.get("/admin/broadcast-message", function(req, res) {
    return res.render("admin/broadcast");
});

// CREATE(POST): SEND NEW BROADCAST TO USERS
router.post("/admin/broadcast-message", function(req, res) {
    if (req.body.recipient == "-1") {
        req.flash("error", "Please select a recipient.");
        return res.redirect("back");
    }

    var broadcastMessage = {
        date: new Date().toLocaleString("en-NG"),
        content: req.body.content,
        status: "unread",
    }

    User.find({ typeOfUser: req.body.recipient }, function(err, users) {
        if (err) {
            req.flash("error", "Oops! Something isn't quite right.");
            return res.redirect("back");
        }

        users.forEach(function(user) {
            user.notifications.unshift(broadcastMessage);
            user.unread_notifications_count += 1;
            user.save(function(err, user) {
                if (err) {
                    req.flash("error", "Oops! Something isn't quite right.")
                    return res.redirect("back");
                }
            });
        });
        return res.redirect("/admin/dashboard");
    });
});

module.exports = router;