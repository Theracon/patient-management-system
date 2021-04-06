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










// CREATE: MAKE & SEND NEW MESSAGE/REFERRERS
router.post('/referrers/:id/messages', function (req, res) {
    // Find referrer
    User.findById(req.params.id, function (err, foundReferrer) {
        if (err) {
        console.log('Error while finding referrer: ', err);
        }
        // Create a new message
        var message = new Message();
        message.username = uniqid();
        message.author_id = foundReferrer._id;
        message.author_name = foundReferrer.title + ' ' + foundReferrer.name;
        message.subject = req.body.subject;
        message.content = req.body.content;
        message.sender = 'referrer';
        message.urgency = req.body.urgency ? 'urgent' : 'not urgent';
        message.status = 0;
        message.date =
        date.getDate() +
        '-' +
        Functions.addZero(date.getMonth() + 1) +
        '-' +
        date.getFullYear();
        // Save newly created message
        message.save(function (err, savedMessage) {
        if (err) {
            console.log('Error while saving new message: ', err);
        }
        // Push newly created message into referrer's 'sent_messages' array
        foundReferrer.messages.push(message);
        // Save referrer with update
        foundReferrer.save(function (err, savedReferrer) {
            if (err) {
            console.log('Error while saving referrer with new message: ', err);
            }
            // Redirect to messages page
            res.redirect('/referrers/' + savedReferrer._id + '/messages');
            console.log(savedMessage);
        });
        });
    });
});



/* /*************************************
Deregister
*/ /*************************************/
//SHOW: DEREGISTER FORM/REFERRERS
router.get("/referrers/:id/deregister", isUserLoggedIn, isReferrerAuthorized, function(req, res) {
    User.findById(req.params.id, function(err, foundReferrer) {
        if(err) { console.log("Error while trying to find user: ", err); return }
        res.render("referrers/deregister", { referrer: foundReferrer });
    });
});
// DELETE: REMOVE REFERRER FROM DATABASE/REFERRERS
router.delete("/referrers/:id/deregister", isUserLoggedIn, isReferrerAuthorized, function(req, res) {
    User.findById(req.params.id, function(err, foundReferrer) {
        if(err) { console.log("Error while trying to find user: ", err) }
        // Make new DeregisteredReferrer object
        var newDeregisteredReferrer = new DeregisteredReferrer();
        newDeregisteredReferrer.username = foundReferrer.username;
        newDeregisteredReferrer.title = foundReferrer.title;
        newDeregisteredReferrer.firstname = foundReferrer.firstname;
        newDeregisteredReferrer.lastname = foundReferrer.lastname;
        newDeregisteredReferrer.name = foundReferrer.name;
        newDeregisteredReferrer.institution = foundReferrer.institution;
        newDeregisteredReferrer.address = foundReferrer.address;
        newDeregisteredReferrer.phone = foundReferrer.phone;
        newDeregisteredReferrer.bank = foundReferrer.bank;
        newDeregisteredReferrer.ac_number = foundReferrer.ac_number;
        newDeregisteredReferrer.ac_name = foundReferrer.ac_name;
        newDeregisteredReferrer.image = foundReferrer.image;
        newDeregisteredReferrer.count = foundReferrer.count;
        newDeregisteredReferrer.commission = foundReferrer.commission;
        newDeregisteredReferrer.patients = foundReferrer.patients;
        newDeregisteredReferrer.messages = foundReferrer.messages;
        newDeregisteredReferrer.role = -1;
        newDeregisteredReferrer.reason_for_deactivating = req.body.reason;
        // Save new Deregistered referrer
        newDeregisteredReferrer.save(function(err, savedDeregisteredReferrer) {
        if(err) { console.log("Error saving new deregistered referrer: ", err) }
        // Remove referrer from database
        User.findByIdAndRemove(req.params.id, function(err) {
            if(err) {
            console.log("Error deleting referrer: ", err);
            // Reload deregister page
            res.redirect("/referrers/" + foundReferrer._id + "/deregister");
            }
            // Redirect to landing page
            res.redirect("/");
        });
        });
    });
});

module.exports = router;