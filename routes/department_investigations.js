var express = require("express"),
    router = express.Router(),
    User = require("../models/user");

// SHOW(GET): SHOW FORM TO CREATE DEPARTMENTAL INVESTIGATIONS
router.get("/departments/:username/investigations", function(req, res) {
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                return res.render("departments/createInvestigations", { user });
            }

            req.flash("error", "Please login or create an account.");
            return res.redirect("/accounts/departments/login");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// CREATE(POST): CREATE DEPARTMENTAL INVESTIGATIONS
router.post("/departments/:username/investigations", function(req, res) {
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                var obj = { style: "currency", currency: "NGN" };

                if (typeof req.body.name == "object") {
                    for (var i = 0; i < req.body.name.length; i++) {
                        var amountInNaira = Number(req.body.price[i]).toLocaleString("en-NG", obj);
                        var investigation = {
                            name: req.body.name[i],
                            number_price: req.body.price[i],
                            price: amountInNaira
                        }

                        user.department_details.investigations.push(investigation);
                    }
                } else {
                    var amountInNaira = Number(req.body.price).toLocaleString("en-NG", obj);
                    var investigation = {
                        name: req.body.name,
                        number_price: req.body.price,
                        price: amountInNaira
                    }

                    user.department_details.investigations.push(investigation);
                }

                user.save(function(err, user) {
                    if (err) {
                        console.log(err);
                        req.flash("error", "Oops! Something isn't quite right.");
                        return res.redirect("back");
                    }

                    return res.redirect("/admin/" + user.username + "/department-created");
                });
                return;
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/accounts/departments/login");
        }
        req.flash("error", "Oops! Something isn't quite right.");
        res.redirect("back");
    });
});

// SHOW(GET): SHOW FORM TO EDIT DEPARTMENTAL INVESTIGATIONS
router.get("/departments/:username/investigations/edit", function(req, res) {
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                return res.render("departments/editInvestigations", { user });
            }

            req.flash("error", "Please login or create an account.");
            return res.redirect("/accounts/departments/login");
        }
        req.flash("error", "Oops! Something isn't quite right.")
        res.redirect("back");
    });
});

// UPDATE(PUT): UPDATE DEPARTMENTAL INVESTIGATIONS
router.put("/departments/:username/investigations/update", function(req, res) {
    User.findOne({ typeOfUser: "department", username: req.params.username }, function(err, user) {
        if (!err) {
            if (user) {
                user.department_details.investigations = [];

                var obj = { style: "currency", currency: "NGN" };

                if (typeof req.body.name == "object") {
                    for (var i = 0; i < req.body.name.length; i++) {
                        var amountInNaira = Number(req.body.price[i]).toLocaleString("en-NG", obj);
                        var investigation = {
                            name: req.body.name[i],
                            number_price: req.body.price[i],
                            price: amountInNaira
                        }
                        user.department_details.investigations.push(investigation);
                    }
                } else {
                    var amountInNaira = Number(req.body.price).toLocaleString("en-NG", obj);
                    var investigation = {
                        name: req.body.name,
                        number_price: req.body.price,
                        price: amountInNaira
                    }
                    user.department_details.investigations.push(investigation);
                }

                user.save(function(err, user) {
                    if (err) {
                        console.log(err);
                        req.flash("error", "Oops! Something isn't quite right.");
                        return res.redirect("back");
                    }

                    return res.redirect("/departments/" + user.username + "/profile");
                });
                return;
            }
            req.flash("error", "Please login or create an account.");
            return res.redirect("/accounts/departments/login");
        }
        req.flash("error", "Oops! Something isn't quite right.");
        res.redirect("back");
    });
});

module.exports = router;