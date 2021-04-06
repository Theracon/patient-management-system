var express                 = require("express"),
    router                  = express.Router(),
    User                    = require("../models/user"),
    uniqid                  = require("uniqid"),
    middleware              = require("../middleware"),
    Patient                 = require("../models/patient"),
    functions               = require("../functions"),
    salt                    = Math.floor(Math.random() * 100),
    randomID                = uniqid.time("", salt).toUpperCase(),
    hospitals               = ["Mayfield Specialist Hospital", "Nizamiye Hospital", "e-Clinic & Diagnostics"],
    date                    = new Date(),
    months                  =   [ 'January','February','March','April','May','June','July',
                                'August','September','October','November','December',
                                ];

// SHOW(GET): ALL MESSAGES/REFERRERS
router.get('/referrers/:id/messages', middleware.isUserLoggedIn, middleware.isReferrerAuthorized, function (req, res) {
    // Find user in db
    User.findOne({ typeOfUser: "referrer", _id: req.params.id}, function(err, user) {
        if(!err) {
            if(user) {
                // Render referrer messages template
                return res.render("referrers/messages");
            }
            req.flash("error", "Please login or create an account.");
            res.redirect("/login");
            return;
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// NEW(GET): SHOW CONTACT TEMPLATE WITH NEW MESSAGE FORM/REFERRERS
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

// CREATE(POST): CREATE NEW MESSAGE/REFERRERS
router.post("/referrers/:id/messages", function(req, res) {
    // Find referrer
    // Make new message object
    // Push new message object into referrer messages array ()
});


// NEW(GET): NEW MESSAGE REPLY FORM/REFERRERS

// CREATE(POST): CREATE NEW MESSAGE REPLY/REFERRERS

module.exports = router;