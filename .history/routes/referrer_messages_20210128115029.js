var express                 = require("express"),
    router                  = express.Router(),
    User                    = require("../models/user"),
    middleware              = require("../middleware"),
    functions               = require("../functions"),
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
    User.findOne({ typeOfUser: "referrer", _id: req.params.id }, function(err, user) {
        if(!err) {
            if(user) {
                // Make new message object
                var newMessage = {
                    typeOfSender: "referrer",
                    author_id: user._id,
                    author_name: user.modelName,
                    content: req.body.content,
                    time: functions.formatTime(date),
                    month: months[date.getMonth()],
                    date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                }
                // Push new message object into referrer messages array (user > referrerDetails > messages)
                user.refe
                // Save updated user
                // Redirect to messages route
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


// NEW(GET): NEW MESSAGE REPLY FORM/REFERRERS

// CREATE(POST): CREATE NEW MESSAGE REPLY/REFERRERS

module.exports = router;