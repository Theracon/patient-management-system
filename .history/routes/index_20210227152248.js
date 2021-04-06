var express         = require("express"),
    router          = express.Router(),
    passport        = require("passport"),
    middleware      = require("../middleware"),
    User            = require("../models/user"),
    Admin           = require("../models/admin"),
    functions       = require("../functions"),
    date            = new Date(),
    months          = ['January','February','March','April','May','June','July',
                        'August','September','October','November','December'];

/******************************************************************************************************************************/
// ADMIN ROUTES
/******************************************************************************************************************************/
// INDEX(GET): ADMIN SIGNUP PAGE/ADMIN
router.get("/admin/register", function(req, res) {
    res.render("admin/register");
});

// CREATE(POST): CREATE ADMIN/ADMIN
router.post("/admin/register", function(req, res) {
    User.findOne({ typeOfUser: "admin", username: req.body.username }, function(err, user) {
        if(!err) {
            if(user) {
                req.flash("error", "A user with that username already exists.");
                res.redirect("back");
                return
            }
            var admin = { typeOfUser: "admin", username: req.body.username };
            User.register(new User(admin), req.body.password, function(err, user) {
                if(!err) {
                    passport.authenticate("local")(req, res, function() {
                        req.flash("success", "Welcome to PatientRef, Admin.");
                        return res.redirect("/admin/dashboard");
                    });
                    return;
                }
                req.flash("error", "Oops! An error occurred at sign up.");
                return res.redirect("back");
            });
            return;
        }
        req.flash("error", "Oops! An error occurred at sign up.");
        return res.redirect("back");
    });
});

// LOGIN(GET): SHOW ADMIN LOGIN FORM/ADMIN
router.get("/admin/login", function(req, res) {
    res.render("admin/login");
});

// LOGIN(POST): ADMIN LOGIN/ADMIN
router.post("/admin/login", function(req, res) {
    User.findOne({ typeOfUser: "admin", username: req.body.username }, function(err, user) {
        if(!err) {
            if(user) {
                passport.authenticate("local")(req, res, function() {
                    req.flash("success", "Welcome back, admin.");
                    return res.redirect("/admin/dashboard");
                });
                return;
            }
            req.flash("error", "Sorry, user does not exist. Ensure username is correct.")
            res.redirect("/admin/login");
            return;
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});



/******************************************************************************************************************************/
// HOSPITAL ROUTES (VERB: ROUTE NAME/AUTHORIZATION)
/******************************************************************************************************************************/
// INDEX(GET): REGISTER HOSPITAL FORM/ALL
router.get("/hospitals/register", function(req, res) {
    res.render("hospitals/register");
});

// CREATE(POST): ADD NEW HOSPITAL TO DATABASE/ALL
router.post('/hospitals/register', function (req, res) {
    // Check if username exists in the db
    User.findOne({ typeOfUser: "hospital", username: req.body.username }, function(err, user) {
        if(!err) {
            if(user) {
                req.flash("error", "A hospital with that username already exists.");
                res.redirect("back");
                return
            }
            User.register(new User({ 
                typeOfUser: "hospital", 
                username: req.body.username,  
                referrerDetails: null, 
                signup_time: functions.formatTime(date),
                signup_date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                signup_month: months[date.getMonth()],
                signup_year: date.getFullYear(),
            }), req.body.password, function(err, user) {
                if(!err) {
                    passport.authenticate("local")(req, res, function() {
                        req.flash("success", "Welcome to PatientRef.");
                        res.redirect('/hospitals/' + req.user.username + "/details");
                        return;
                    });
                    return;
                }
                req.flash("error", "Oops! An error occurred at sign up.");
                return res.redirect("back");
            });
            return;
        }
        req.flash("error", "Oops! An error occurred at sign up.");
        return res.redirect("back");
    });
});

// LOGIN(POST): HOSPITAL LOGIN/HOSPITALS
router.post("/hospitals/login", function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.body.username }, function(err, user) {
        if(!err) {
            if(user) {
                passport.authenticate("local")(req, res, function() {
                    req.flash("success", "Welcome back.");
                    return res.redirect('/hospitals/' + req.user.username + "/dashboard");
                });
                return;
            }
            req.flash("error", "Sorry, user does not exist. Ensure username and password are correct.")
            res.redirect("/login");
            return;
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

/******************************************************************************************************************************/
// REFERRER ROUTES
/******************************************************************************************************************************/
// CREATE(POST): ADD NEW REFERRER TO DATABASE/ALL
router.post('/referrers/register', function (req, res) {
    // Check if username exists in the db
    User.findOne({ typeOfUser: "referrer", username: req.body.username }, function(err, user) {
        if(!err) {
            if(user) {
                req.flash("error", "A user with that username already exists.");
                res.redirect("back");
                return
            }
            User.register(new User({ 
                typeOfUser: "referrer", 
                username: req.body.username,  
                hospitalDetails: null, 
                signup_time: functions.formatTime(date),
                signup_date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
                signup_month: months[date.getMonth()],
                signup_year: date.getFullYear(),
            }), req.body.password, function(err, user) {
                if(!err) {
                    passport.authenticate("local")(req, res, function() {
                        req.flash("success", "Welcome to PatientRef.");
                        res.redirect('/referrers/' + req.user.username + "/update");
                        return;
                    });
                    return;
                }
                req.flash("error", "Oops! An error occurred at sign up.");
                return res.redirect("back");
            });
            return;
        }
        req.flash("error", "Oops! An error occurred at sign up.");
        return res.redirect("back");
    });
});

// LOGIN: REFERRER LOGIN LOGIC/REFERRERS
router.post("/referrers/login", function(req, res) {
    User.findOne({ typeOfUser: "referrer", username: req.body.username }, function(err, user) {
        if(!err) {
            if(user) {
                passport.authenticate("local")(req, res, function() {
                    req.flash("success", "Welcome back.");
                    return res.redirect('/referrers/' + req.user.username + "/dashboard");
                });
                return;
            }
            req.flash("error", "Sorry, user does not exist. Ensure username and password are correct.")
            res.redirect("/login");
            return;
        }
        req.flash("error", "Oops! An error occurred.");
        res.redirect("back");
    });
});

/******************************************************************************************************************************/
// SHARED AUTH ROUTES 
/******************************************************************************************************************************/
router.get("/register", function(req, res) {
    res.render("index/register");
});

// LOG IN: LOGIN FORM/ALL
router.get('/login', function (req, res) {
    res.render('index/login');
});

// LOG OUT: USER LOGOUT/ALL
router.get('/logout', function (req, res) {
    req.logout();
    req.flash("success", "Logged out.");
    res.redirect('/login');
});

/******************************************************************************************************************************/
// GENERAL (NON-AUTH) ROUTES/ALL
/******************************************************************************************************************************/
// INDEX(GET): SIGNUP FORM (REFERRERS & HOSPITALS)/ALL
router.get('/', function (req, res) {
    res.render('index/index');
});

// INDEX(GET): LANDING PAGE/ALL
router.get('/home', function (req, res) {
    res.render('index/home');
});

// SHOW: TERMS ROUTE/ALL
router.get('/terms', function (req, res) {
    res.render('index/terms');
});

// SHOW: PRIVACY POLICY ROUTE/ALL
router.get('/privacy', function (req, res) {
    res.render('index/privacy');
});

// ERROR ROUTE
router.get('/error', function (req, res) {
    res.render('index/error');
});
// PLAN ROUTE
router.get('/plan', function (req, res) {
    res.render('index/plan');
});

// FAQ ROUTE
router.get("/faq", function(req, res) {
    res.render("index/faq");
});

// SHOW(GET): CONTACT PAGE/ALL
router.get('/contact', function (req, res) {
    res.render("index/contact");
});

// SHOW(GET): ABOUT PAGE/ALL
router.get("/about", function(req, res) {
    res.render("index/about");
});

// SHOW(GET): BLOG/ALL
router.get("/blog", function(req, res) {
    res.render("index/blog");
});

// SHOW(GET): NO AUTHORIZATION/ALL
router.get("/blog", function(req, res) {
    res.render("index/blog");
});

// SHOW(GET): ALL HOSPITALS/ALL
router.get("/hospitals", function(req, res) {
    User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
        if(err) {
            req.flash("error", "Oops! Something isn't quite right.");
            return res.redirect("back");
        }
        res.render("index/hospitals", { hospitals: hospitals });
    });
});

// SHOW(GET): HOSPITAL DETAILS/ALL
router.get("/hospitals/:username", function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, hospital) {
        if(err) {
            req.flash("error", "Oops! Something isn't quite right.");
            return res.redirect("back");
        }
        res.render("index/showHospital", { hospital: hospital });
    });
});

module.exports = router;