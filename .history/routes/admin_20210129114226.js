var express         = require("express"),
    router          = express.Router(),
    passport        = require("passport"),
    User            = require("../models/user"),
    middleware      = require("../middleware"),
    functions       = require("../functions");

router.get("/admin/:username/dashboard", middleware.isAdminLoggedIn function(req, res) {
    res.render("admin/dashboard");
});

module.exports = router;