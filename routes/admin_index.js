var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware");

// SHOW(GET): ADMIN DASHBOARD/ADMIN
router.get("/admin/dashboard", middleware.isAdminLoggedIn, middleware.isAdminAuthorized, function(req, res) {
    res.render("admin/dashboard");
});

module.exports = router;