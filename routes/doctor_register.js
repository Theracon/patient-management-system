var date = new Date(),
    express = require("express"),
    passport = require("passport"),
    router = express.Router(),
    User = require("../models/user");

// INDEX(GET): SIGN UP PAGE/ALL
router.get("/accounts/doctors/register", function(req, res) {
    User.find({ typeOfUser: "department" }, function(err, departments) {
        return res.render("doctors/register", { departments });
    });
});

// CREATE(POST): ADD A NEW REFERRER TO DATABASE/ALL
router.post('/accounts/doctors/register', function(req, res) {
    // Check if username exists in the database
    User.findOne({ typeOfUser: "doctor", username: req.body.username }, function(err, user) {
        if (!err) {
            if (user) {
                req.flash("error", "Sorry, that username is taken.");
                return res.redirect("back");
            }

            date = new Date();

            // Create admin message
            var welcomeMessage = {
                date: date.toLocaleString("en-NG"),
                content: "Hello, there! Welcome to My Clinic.",
                status: "unread"
            }

            var doctor = new User({
                typeOfUser: "doctor",
                username: req.body.username,
                password: req.body.password,
                doctor_details: {
                    firstname: req.body.firstname,
                    middlename: req.body.middlename,
                    lastname: req.body.lastname,
                },
                department_details: null,
                signup_date: date.toLocaleString("en-NG"),
            });

            User.findOne({ typeOfUser: "department", username: req.body.department }, function(err, department) {
                doctor.doctor_details.department_id = department._id;
                doctor.doctor_details.department = department.department_details.name;
            });

            // Push welcome message into doctor notifications array
            doctor.notifications.push(welcomeMessage);

            // Update doctor unread notifications count
            doctor.unread_notifications_count = 1;

            User.register(doctor, doctor.password, function(err, user) {
                if (!err) {
                    doctor.save(function(err, referrer) {
                        passport.authenticate("local")(req, res, function() {
                            req.flash("success", "Hello there! Welcome to My Clinic.");
                            return res.redirect('/admin/' + user.username + "/doctor-created");
                        });
                    });
                    return;
                }
                req.flash("error", "Oops! Something isn't quite right.")
                return res.redirect("back");
            });
            return;
        }
        req.flash("error", "Oops! Something isn't quite right.")
        return res.redirect("back");
    });
});

module.exports = router;