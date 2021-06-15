var User = require("../models/user");

var express = require("express"),
    router = express.Router();

// SHOW(GET): ADMIN DASHBOARD/ADMIN
router.get("/admin/dashboard", function(req, res) {
    return res.render("admin/dashboard");
});

// SHOW(GET): SHOW INFO OF CREATED USER
router.get("/admin/:username/user-created", function(req, res) {
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, user) {
        return res.render("admin/userCreated", { user });
    });
});

module.exports = router;