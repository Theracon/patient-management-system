var express = require("express"),
    router = express.Router(),
    User = require("../models/user");

// SHOW(GET): HOSPITAL DASHBOARD/HOSPITALS
router.get("/departments/:username/dashboard", function(req, res) {
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                return res.render("departments/dashboard", { user });
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

module.exports = router;