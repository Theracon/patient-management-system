var express                 = require("express"),
    router                  = express.Router(),
    User                    = require("../models/user"),
    middleware              = require("../middleware");

// SHOW(GET): DASHBOARD/REFERRERS
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

// SHOW(GET): CONTACT TEMPLATE/REFERRERS
router.get('/referrers/:id/contact', middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function (req, res) {
    User.findOne({ typeOfUser: "referrer", _id: req.params.id }, function(err, user) {
        if(!err) {
            if(user) {
                // Render referrer new message template
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
    
});


module.exports = router;