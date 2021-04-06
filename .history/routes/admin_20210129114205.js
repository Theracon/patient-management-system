var express         = require("express"),
    router          = express.Router(),
    passport        = require("passport"),
    User            = require("../models/user"),
    middl
    functions       = require("../functions");

router.get("/admin/:username/dashboard", function(req, res) {
    res.render("admin/dashboard");
});

module.exports = router;