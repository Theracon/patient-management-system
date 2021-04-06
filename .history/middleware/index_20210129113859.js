var middlewareMethods = {};

/* ====================
REFERRER & HOSPITAL LOGIN MIDDLEWARE
 ==================== */
middlewareMethods.isAdminLoggedIn = function(req, res, next)

/* ====================
REFERRER & HOSPITAL LOGIN MIDDLEWARE
 ==================== */
middlewareMethods.isUserLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
        return;
    }
    req.flash("error", "Please log in or sign up.");
    res.redirect('/login');
};


/* ====================
REFERRER AUTHORIZATION MIDDLEWARE
 ==================== */
middlewareMethods.isReferrerAuthorized = function(req, res, next) {
    if (req.user) {
        if (req.user.role == 0) {
            next();
        } else {
            req.flash("error", "Please update your profile to continue.");
            res.redirect("/referrers/" + req.user._id + "/update");
            return;
        }
        return;
    }
    req.flash("error", "Please log in or sign up.");
    res.redirect("/login");
}

/* ====================
HOSPITAL AUTHORIZATION MIDDLEWARE
 ==================== */
middlewareMethods.isHospitalStepTwoDone = function(req, res, next) {
    if (req.user) {
        if (req.user.role >= 0.5) {
            return next();
        } else {
            req.flash("error", "Please update your hospital's profile to continue.");
            return res.redirect("/hospitals/" + req.user._id + "/details");
        }
    }
    req.flash("error", "Please log in or sign up.");
    res.redirect("/login");
}

middlewareMethods.isHospitalStepThreeDone = function(req, res, next) {
    if (req.user) {
        if (req.user.role === 1) {
            return next();
        } else {
            req.flash("error", "Please log in or sign up.");
            return res.redirect("/hospitals/" + req.user._id + "/departments");
        }
    }
    req.flash("error", "Please log in or sign up.");
    res.redirect("/login");
}

module.exports = middlewareMethods;