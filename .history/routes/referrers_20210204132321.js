var express                 = require("express"),
    router                  = express.Router(),
    User                    = require("../models/user"),
    middleware              = require("../middleware");

// SHOW(GET): DASHBOARD/REFERRERS
router.get('/referrers/:id/dashboard', middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function (req, res) {
    res.render("referrers/dashboard");
});

// SHOW(GET): CONTACT TEMPLATE/REFERRERS
router.get('/referrers/:id/contact', middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function (req, res) {
    res.render("referrers/contact");
});

// SHOW(GET): NOTIFICATIONS/REFERRERS
router.get("/referrers/:id/notifications", middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function(req, res) {
    res.render("referrers/notifications");
});


module.exports = router;