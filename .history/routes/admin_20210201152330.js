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

// SHOW(GET): LIVE CHAT PAGE/ADMIN
router.get("/admin/livechat", middleware.isAdminLoggedIn, middlear function(req, res) {

});

module.exports = router;