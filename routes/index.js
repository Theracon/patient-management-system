var express = require("express"),
    router = express.Router(),
    User = require("../models/user");


/******************************************************************************************************************************/
// OTHER AUTH ROUTES (VERB: ROUTE NAME/AUTHORIZATION)
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


/******************************************************************************************************************************/
// GENERAL ROUTES/ALL
/******************************************************************************************************************************/
// REGISTER(GET): REGISTER FORM/ALL
router.get("/register", function(req, res) {
    res.render("index/register");
});

// LOGIN(GET): LOGIN FORM/ALL
router.get('/login', function(req, res) {
    res.render('index/login');
});

// INDEX(GET): SIGNUP FORM (REFERRERS & HOSPITALS)/ALL
router.get('/', function(req, res) {
    res.render('index/index');
});

// INDEX(GET): LANDING PAGE/ALL
router.get('/home', function(req, res) {
    res.render('index/home');
});

// SHOW(GET): TERMS ROUTE/ALL
router.get('/terms', function(req, res) {
    res.render('index/terms');
});

// SHOW(GET): PRIVACY POLICY ROUTE/ALL
router.get('/privacy', function(req, res) {
    res.render('index/privacy');
});

// SHOW(GET): ERROR ROUTE/ALL
router.get('/error', function(req, res) {
    res.render('index/error');
});
// SHOW(GET): PLAN ROUTE/ALL
router.get('/plan', function(req, res) {
    res.redirect('index/about');
});

// SHOW(GET): FAQ ROUTE/ALL
router.get("/faq", function(req, res) {
    res.render("index/faq");
});

// SHOW(GET): CONTACT PAGE/ALL
router.get('/contact', function(req, res) {
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
router.get("/no-auth", function(req, res) {
    res.render("index/notAuthorized");
});

// SHOW(GET): ALL HOSPITALS/ALL
router.get("/hospitals", function(req, res) {
    User.find({ typeOfUser: "hospital" }, function(err, hospitals) {
        if (err) {
            req.flash("error", "Oops! Something isn't quite right.");
            return res.redirect("back");
        }
        res.render("index/hospitals", { hospitals: hospitals });
    });
});

// SHOW(GET): HOSPITAL DETAILS/ALL
router.get("/hospitals/:username", function(req, res) {
    User.findOne({ typeOfUser: "hospital", username: req.params.username }, function(err, hospital) {
        if (err) {
            req.flash("error", "Oops! Something isn't quite right.");
            return res.redirect("back");
        }
        res.render("index/showHospital", { hospital: hospital });
    });
});

module.exports = router;