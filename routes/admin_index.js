var User = require("../models/user");

var express = require("express"),
    router = express.Router();

// SHOW(GET): ADMIN DASHBOARD/ADMIN
router.get("/admin/dashboard", function(req, res) {
    return res.render("admin/dashboard");
});

// SHOW(GET): SHOW INFO OF CREATED DEPARTMENT
router.get("/admin/:username/department-created", function(req, res) {
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, user) {
        return res.render("admin/departmentCreated", { user });
    });
});

// SHOW(GET): SHOW INFO OF CREATED DOCTOR
router.get("/admin/:username/doctor-created", function(req, res) {
    User.findOne({ typeOfUser: "doctor", username: req.params.username }, function(err, user) {
        return res.render("admin/doctorCreated", { user });
    });
});

module.exports = router;