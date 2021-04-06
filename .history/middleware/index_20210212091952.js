var middlewareMethods = {};

/* ====================
ADMIN LOGIN MIDDLEWARE
 ==================== */
middlewareMethods.isAdminLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
        return;
    }
    req.flash("error", "Please log in or sign up.");
    res.redirect('/admin/login');
}

/* ====================
ADMIN AUTHORIZATION MIDDLEWARE
 ==================== */
middlewareMethods.isAdminAuthorized = function(req, res, next) {
    if (req.user) {
        if (req.user.typeOfUser === "admin") {
            next();
        } else {
            req.flash("error", "Sorry, you are not authorized to view that page.");
            res.redirect("back");
            return;
        }
        return;
    }
    req.flash("error", "Please log in or sign up.");
    res.redirect("/login");
}

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
        if (req.user.role === 1) {
            next();
        } else {
            if(req.user.role === 0) {
                res.redirect("/referrers/" + req.user._id + "/pending");
                return;
            } else {
                res.redirect("/referrers/" + req.user._id + "/update");
                req.flash("error", "Please update your profile to continue.");
                return;
            }
        }
        return;
    }
    req.flash("error", "Please log in or sign up.");
    res.redirect("/login");
}

/* ====================
HOSPITAL AUTHORIZATION MIDDLEWARE
 ==================== */
middlewareMethods.isHospitalProfileCreated = function(req, res, next) {
    if (req.user) {
        if (req.user.role === 0) {
            return next();
        } else {
            req.flash("error", "Please finish creating your hospital profile.");
            return res.redirect("/hospitals/" + req.user._id + "/details");
        }
    }
    req.flash("error", "Please log in or sign up.");
    res.redirect("/login");
}

middlewareMethods.isHospitalDepartmentCreated = function(req, res, next) {
    if (req.user) {
        if (req.user.role >= 0.75) {
            return next();
        } else {
            if(req.user.role === 0) {
                req.flash("error", "Please finish creating your hospital profile.");
                return res.redirect("/hospitals/" + req.user._id + "/departments");
            } else {
                req.flash("error", "Please finish creating your hospital profile.");
                return res.redirect("/hospitals/" + req.user._id + "/details");
            }
        }
    }
    req.flash("error", "Please log in or sign up.");
    res.redirect("/login");
}

module.exports = middlewareMethods;