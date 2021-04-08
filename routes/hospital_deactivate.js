var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    middleware = require("../middleware");

// SHOW(GET): FORM TO DEACTIVATE/HOSPITALS
router.get("/hospitals/:username/deactivate", middleware.isUserLoggedIn, middleware.isHospitalDepartmentCreated, function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                return res.render("hospitals/deactivate");
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/login");
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

// REMOVE(DELETE): DEACTIVATE HOSPITAL/HOSPITALS + ADMIN
router.delete("/hospitals/:id", middleware.isUserLoggedIn, function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash("error", "Oops! An error occurred.");
            return res.redirect("back");
        }
        return res.redirect("/hospitals/register");
    });
});

module.exports = router;