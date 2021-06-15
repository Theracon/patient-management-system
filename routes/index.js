var express = require("express"),
    router = express.Router();


/******************************************************************************************************************************/
// GENERAL ROUTES/ALL
/******************************************************************************************************************************/
// INDEX(GET): LOADING PAGE/ALL
router.get('/', function(req, res) {
    res.render('index/index');
});

// INDEX(GET): LANDING PAGE/ALL
router.get('/home', function(req, res) {
    res.render("index/home");
});

// REGISTER(GET): REGISTER FORM/ALL
router.get("/register", function(req, res) {
    res.render("index/register");
});

// LOGIN(GET): LOGIN FORM/ALL
router.get('/login', function(req, res) {
    res.render("index/login");
});

// SHOW(GET): TERMS ROUTE/ALL
router.get('/terms', function(req, res) {
    res.render("index/terms");
});

// SHOW(GET): PRIVACY POLICY ROUTE/ALL
router.get('/privacy', function(req, res) {
    res.render("index/privacy");
});

// SHOW(GET): ERROR ROUTE/ALL
router.get('/error', function(req, res) {
    res.render("index/error");
});

// SHOW(GET): CONTACT PAGE/ALL
router.get('/contact', function(req, res) {
    res.render("index/contact");
});

// SHOW(GET): NO AUTHORIZATION/ALL
router.get("/no-auth", function(req, res) {
    res.render("index/notAuthorized");
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