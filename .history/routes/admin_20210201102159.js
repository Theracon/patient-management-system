var express         = require("express"),
    router          = express.Router(),
    passport        = require("passport"),
    User            = require("../models/user"),
    middleware      = require("../middleware"),
    functions       = require("../functions");

// SHOW(GET): ADMIN DASHBOARD/ADMIN
router.get("/admin/dashboard", middleware.isAdminLoggedIn, middleware.isAdminAuthorized, function(req, res) {
    res.render("admin/dashboard");
});

// ADMIN LIVE CHAT/ADMIN
router.get("/livechat/:type", middleware.isAdminLoggedIn, middleware.isAdminAuthorized, function(req, res) {
    res.render("index/livechat");
});

module.exports = router;