var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    Patient = require("../models/patient"),
    hospitalCount = '',
    referrerCount = '',
    patientCount = '';


/******************************************************************************************************************************/
// GENERAL ROUTES/ALL
/******************************************************************************************************************************/
// INDEX(GET): LOADING PAGE/ALL
router.get('/', function(req, res) {
    res.render('index/index');
});

// INDEX(GET): LANDING PAGE/ALL
router.get('/home', function(req, res) {
    // Fetch all hospitals
    User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
        // Fetch all referrers
        User.find({ typeOfUser: "referrer" }, function(err, referrers) {
            // Fetch all patients
            Patient.find({}, function(err, patients) {
                // Update counts
                hospitalCount = hospitals.length;
                referrerCount = referrers.length;
                patientCount = patients.length;
                res.render("index/home", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
            });
        });
    });
});

// REGISTER(GET): REGISTER FORM/ALL
router.get("/register", function(req, res) {
    // Fetch all hospitals
    User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
        // Fetch all referrers
        User.find({ typeOfUser: "referrer" }, function(err, referrers) {
            // Fetch all patients
            Patient.find({}, function(err, patients) {
                // Update counts
                hospitalCount = hospitals.length;
                referrerCount = referrers.length;
                patientCount = patients.length;
                res.render("index/register", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
            });
        });
    });
});

// LOGIN(GET): LOGIN FORM/ALL
router.get('/login', function(req, res) {
    // Fetch all hospitals
    User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
        // Fetch all referrers
        User.find({ typeOfUser: "referrer" }, function(err, referrers) {
            // Fetch all patients
            Patient.find({}, function(err, patients) {
                // Update counts
                hospitalCount = hospitals.length;
                referrerCount = referrers.length;
                patientCount = patients.length;
                res.render("index/login", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
            });
        });
    });
});

// SHOW(GET): TERMS ROUTE/ALL
router.get('/terms', function(req, res) {
    // Fetch all hospitals
    User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
        // Fetch all referrers
        User.find({ typeOfUser: "referrer" }, function(err, referrers) {
            // Fetch all patients
            Patient.find({}, function(err, patients) {
                // Update counts
                hospitalCount = hospitals.length;
                referrerCount = referrers.length;
                patientCount = patients.length;
                res.render("index/terms", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
            });
        });
    });
});

// SHOW(GET): PRIVACY POLICY ROUTE/ALL
router.get('/privacy', function(req, res) {
    // Fetch all hospitals
    User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
        // Fetch all referrers
        User.find({ typeOfUser: "referrer" }, function(err, referrers) {
            // Fetch all patients
            Patient.find({}, function(err, patients) {
                // Update counts
                hospitalCount = hospitals.length;
                referrerCount = referrers.length;
                patientCount = patients.length;
                res.render("index/privacy", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
            });
        });
    });
});

// SHOW(GET): ERROR ROUTE/ALL
router.get('/error', function(req, res) {
    // Fetch all hospitals
    User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
        // Fetch all referrers
        User.find({ typeOfUser: "referrer" }, function(err, referrers) {
            // Fetch all patients
            Patient.find({}, function(err, patients) {
                // Update counts
                hospitalCount = hospitals.length;
                referrerCount = referrers.length;
                patientCount = patients.length;
                res.render("index/error", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
            });
        });
    });
});
// SHOW(GET): PLAN ROUTE/ALL
router.get('/plan', function(req, res) {
    res.redirect('index/about');
});

// SHOW(GET): FAQ ROUTE/ALL
router.get("/faq", function(req, res) {
    // Fetch all hospitals
    User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
        // Fetch all referrers
        User.find({ typeOfUser: "referrer" }, function(err, referrers) {
            // Fetch all patients
            Patient.find({}, function(err, patients) {
                // Update counts
                hospitalCount = hospitals.length;
                referrerCount = referrers.length;
                patientCount = patients.length;
                res.render("index/faq", { hospitals, hospitalCount, referrerCount, patientCount });
            });
        });
    });
});

// SHOW(GET): CONTACT PAGE/ALL
router.get('/contact', function(req, res) {
    // Fetch all hospitals
    User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
        // Fetch all referrers
        User.find({ typeOfUser: "referrer" }, function(err, referrers) {
            // Fetch all patients
            Patient.find({}, function(err, patients) {
                // Update counts
                hospitalCount = hospitals.length;
                referrerCount = referrers.length;
                patientCount = patients.length;
                res.render("index/contact", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
            });
        });
    });
});

// SHOW(GET): ABOUT PAGE/ALL
router.get("/about", function(req, res) {
    // Fetch all hospitals
    User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
        // Fetch all referrers
        User.find({ typeOfUser: "referrer" }, function(err, referrers) {
            // Fetch all patients
            Patient.find({}, function(err, patients) {
                // Update counts
                hospitalCount = hospitals.length;
                referrerCount = referrers.length;
                patientCount = patients.length;
                res.render("index/about", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
            });
        });
    });
});

// SHOW(GET): BLOG/ALL
router.get("/blog", function(req, res) {
    // Fetch all hospitals
    User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
        // Fetch all referrers
        User.find({ typeOfUser: "referrer" }, function(err, referrers) {
            // Fetch all patients
            Patient.find({}, function(err, patients) {
                // Update counts
                hospitalCount = hospitals.length;
                referrerCount = referrers.length;
                patientCount = patients.length;
                res.render("index/blog", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
            });
        });
    });
});

// SHOW(GET): NO AUTHORIZATION/ALL
router.get("/no-auth", function(req, res) {
    // Fetch all hospitals
    User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
        // Fetch all referrers
        User.find({ typeOfUser: "referrer" }, function(err, referrers) {
            // Fetch all patients
            Patient.find({}, function(err, patients) {
                // Update counts
                hospitalCount = hospitals.length;
                referrerCount = referrers.length;
                patientCount = patients.length;
                res.render("index/notAuthorized", { hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
            });
        });
    });
});

// SHOW(GET): ALL HOSPITALS/ALL
router.get("/hospitals", function(req, res) {
    User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
        if (err) {
            req.flash("error", "Oops! Something isn't quite right.");
            return res.redirect("back");
        }
        // Fetch all hospitals
        User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
            // Fetch all referrers
            User.find({ typeOfUser: "referrer" }, function(err, referrers) {
                // Fetch all patients
                Patient.find({}, function(err, patients) {
                    // Update counts
                    hospitalCount = hospitals.length;
                    referrerCount = referrers.length;
                    patientCount = patients.length;
                    res.render("index/hospitals", { hospitals: hospitals, hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
                });
            });
        });
    });
});

// SHOW(GET): HOSPITAL DETAILS/ALL
router.get("/hospitals/:username", function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, hospital) {
        if (err) {
            req.flash("error", "Oops! Something isn't quite right.");
            return res.redirect("back");
        }
        // Fetch all hospitals
        User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
            // Fetch all referrers
            User.find({ typeOfUser: "referrer" }, function(err, referrers) {
                // Fetch all patients
                Patient.find({}, function(err, patients) {
                    // Update counts
                    hospitalCount = hospitals.length;
                    referrerCount = referrers.length;
                    patientCount = patients.length;
                    res.render("index/showHospital", { hospital: hospital, hospitalCount: hospitalCount, referrerCount: referrerCount, patientCount: patientCount });
                });
            });
        });
    });
});


/******************************************************************************************************************************/
// USER LOG OUT ROUTES (VERB: ROUTE NAME/AUTHORIZATION)
/******************************************************************************************************************************/
// LOGOUT(GET): ADMIN LOGOUT/ADMIN
router.get('/admin/logout', function(req, res) {
    req.logout();
    res.redirect('/admin/login');
});

// LOGOUT(GET): USER LOGOUT/REFERRERS + HOSPITALS
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});


module.exports = router;