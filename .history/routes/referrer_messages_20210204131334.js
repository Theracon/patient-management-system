var express                 = require("express"),
    router                  = express.Router(),
    User                    = require("../models/user"),
    middleware              = require("../middleware"),
    functions               = require("../functions"),
    date                    = new Date(),
    months                  =   [ 'January','February','March','April','May','June','July',
                                'August','September','October','November','December',
                                ];



/*
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
                user.referrerDetails.messages.push(newMessage);
                // Save updated user
                user.save(function(err, user) {
                    if(!err && user) {
                        // Redirect to messages route
                        return res.redirect("/livechat/" + user.typeOfUser);
                    }
                    req.flash("error", "Oops! An error occurred.");
                    return res.redirect("back");
                });
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
*/

module.exports = router;