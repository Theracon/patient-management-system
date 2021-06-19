var express = require("express"),
    router = express.Router(),
    User = require("../models/user");

// SHOW(GET): ALL DEPARTMENTS
router.get("/admin/departments-clinics-and-units", function(req, res) {
    // Fetch all departments
    User.find({ typeOfUser: "department" }, function(err, data) {
        var departments = data.filter(el => el.department_details);
        return res.render("admin/departments", { departments });
    });
});

// SHOW(GET): DEPARTMENT INFO
router.get("/admin/departments-clinics-and-units/:username", function(req, res) {
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, department) {
        if (err) {
            req.flash("error", "Oops! Something isn't quite right.");
            return res.redirect("back");
        }

        return res.render("admin/departmentInfo", { department });
    });
});

// REMOVE(DELETE): REMOVE A DEPARTMENT
router.delete("/admin/departments/:id", function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash("error", "Oops! Something isn't quite right.");
            return res.redirect("back");
        }

        return res.redirect("/admin/departments-clinics-and-units");
    });
    return;
});

module.exports = router;