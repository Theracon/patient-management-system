var express                 = require("express"),
    router                  = express.Router(),
    User                    = require("../models/user"),
    DeregisteredReferrer    = require("../models/dereg_referrer"),
    uniqid                  = require("uniqid"),
    middleware              = require("../middleware"),
    functions               = require("../functions"),
    salt                    = Math.floor(Math.random() * 100),
    randomID                = uniqid.time("", salt).toUpperCase(),
    hospitals               = ["Mayfield Specialist Hospital", "Nizamiye Hospital", "e-Clinic & Diagnostics"],
    date                    = new Date(),
    months                  =   [ 'January','February','March','April','May','June','July',
                                'August','September','October','November','December',
                                ];

// SHOW: REFERRER DASHBOARD/REFERRERS
router.get('/referrers/:id/dashboard', middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function (req, res) {
    // Find referrer in db
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

module.exports = router;