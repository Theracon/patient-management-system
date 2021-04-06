var express                 = require("express"),
    router                  = express.Router(),
    User                    = require("../models/user"),
    Patient                 = require("../models/patient"),
    Message                 = require("../models/message"),
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

/******************************************************************************************************************************/
// MIDDLEWARE
/******************************************************************************************************************************/
// L0GIN
function isUserLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("Yes, user is logged in.");
        return next();
    }
    console.log("No, user is not logged in.");
    res.redirect('/login');
}

// REFERRER AUTHORIZATION
function isReferrerAuthorized(req, res, next) {
    if (req.user.role != null) {
        if (req.user.role == 1) {
            console.log("Yes, user is authorized.");
            return next();
        }
        console.log("No, user is not authorized.");
    }
    console.log("No such user!");
    res.redirect('/referrers/' + req.user._id + '/update');
}
/******************************************************************************************************************************/
// FUNCTIONS
/******************************************************************************************************************************/
// SET REFERRER THUMBNAIL IMAGE
function setTitle() {    
    var docImage =
        'https://static.vecteezy.com/system/resources/thumbnails/000/424/145/small/Medical__28188_29.jpg';
    var otherImage =
        'https://www.pngkit.com/png/detail/281-2812821_user-account-management-logo-user-icon-png.png';
    var regexOne = /doctor/i;
    var regexTwo = /dr/i;
    var regexThree = /dr./i;
    
    if (
        regexOne.test(word) == true ||
        regexTwo.test(word) == true ||
        regexThree.test(word) == true
    ) {
        return docImage;
    } else {
        return otherImage;
        }
}

// ADD ZERO TO SINGLE DIGIT MONTH
function addZero(digit) {
    if (digit.length == 1) {
        return digit;
    } else {
        return '0' + digit;
    }
}
/******************************************************************************************************************************/
// RESTFUL ROUTES FOR REFERRERS (VERB: NAME/AUTHORIZATION)
/******************************************************************************************************************************/
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