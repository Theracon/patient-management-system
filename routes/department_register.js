var date = new Date(),
    express = require("express"),
    passport = require("passport"),
    router = express.Router(),
    User = require("../models/user");

// INDEX(GET): SIGN UP PAGE/ALL
router.get("/accounts/departments/register", function(req, res) {
    return res.render("departments/register");
});

// CREATE(POST): ADD A NEW HOSPITAL TO DATABASE/ALL
router.post('/accounts/departments/register', function(req, res) {
    // Check if username exists in the database
    User.findOne({ typeOfUser: "department", username: req.body.username }, function(err, user) {
        if (!err) {
            if (user) {
                req.flash("error", "Sorry, that username is taken.");
                return res.redirect("back");
            }

            date = new Date();

            var department = new User({
                typeOfUser: "department",
                username: req.body.username,
                password: req.body.password,
                doctor_details: null,
                signup_date: date.toLocaleString("en-NG"),
            });

            User.register(department, department.password, function(err, user) {
                if (!err) {
                    department.save(function(err, department) {
                        passport.authenticate("local")(req, res, function() {
                            req.flash("success", "Hello there! Welcome to Fastclinic.");
                            return res.redirect('/departments/' + req.user.username + "/details");
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