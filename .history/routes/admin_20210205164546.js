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

// NEW(GET): NEW BROADCAST FORM/ADMIN
router.get("/admin/broadcast", middleware.isAdminLoggedIn, middleware.isAdminAuthorized, function(req, res) {
    res.render("admin/broadcast");
});

// CREATE(POST): SEND BROADCAST TO USERS
router.post("/admin/broadcast", middleware.isAdminLoggedIn, middleware.isAdminAuthorized, function(req, res) {
    var recipient = req.body
});

module.exports = router;