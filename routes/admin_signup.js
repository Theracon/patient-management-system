var express = require("express"),
    passport = require("passport"),
    router = express.Router(),
    User = require("../models/user");

// INDEX(GET): ADMIN SIGNUP PAGE/ADMIN
router.get("/admin/register", function(req, res) {
    res.render("admin/register");
});

// CREATE(POST): SIGNUP LOGIC/ADMIN
router.post("/admin/register", function(req, res) {
    User.findOne({ typeOfUser: "admin", username: req.body.username }, function(err, user) {
        if (!err) {
            if (user) {
                req.flash("error", "Sorry, that username is taken.");
                return res.redirect("back");
            }
            var admin = new User({
                typeOfUser: "admin",
                username: req.body.username,
                password: req.body.password
            });
            User.register(admin, admin.password, function(err, user) {
                if (!err) {
                    admin.save(function(err, admin) {
                        passport.authenticate("local")(req, res, function() {
                            req.flash("success", "Hello there! Welcome to Fastclinic.");
                            return res.redirect("/admin/dashboard");
                        });
                    });
                    return;
                }
                req.flash("error", "Oops! Something isn't quite right.")
                return res.redirect("back");
            });
            return;
        }
        req.flash("error", "Oops! Something isn't quite right.")
        return res.redirect("back");
    });
});

module.exports = router;