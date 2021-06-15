var express = require("express"),
    router = express.Router(),
    User = require("../models/user");


// SHOW(GET): DASHBOARD/REFERRERS
router.get('/doctors/:username/dashboard', function(req, res) {
    User.findOne({ typeOfUser: "doctor", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                return res.render("doctors/dashboard", { user });
            }
            req.flash("error", "Please login or create an account.");
            res.redirect("accounts/doctors/login");
            return;
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

module.exports = router;