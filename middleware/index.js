var middlewareMethods = {};

/* ====================
ADMIN LOGIN MIDDLEWARE
 ==================== */
middlewareMethods.isAdminLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
        return;
    }
    req.flash("error", "Your session has expired. Please log in.");
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
            req.flash("error", "You are not authorized to view that page.");
            res.redirect("back");
            return;
        }
        return;
    }
    req.flash("error", "Your session has expired. Please log in.");
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
    req.flash("error", "Your session has expired. Please log in.");
    res.redirect('/login');
};

/* ====================
REFERRER AUTHORIZATION MIDDLEWARE
 ==================== */
middlewareMethods.isReferrerAuthorized = function(req, res, next) {
    if (req.user) {
        if (req.user.role === 1) {
            return next();
        } else {
            if (req.user.role === 0) {
                return res.redirect("/referrers/" + req.user.username + "/pending");
            } else if (req.user.role === -1) {
                return res.redirect("/referrers/" + req.user.username + "/suspended");
            } else {
                req.flash("error", "Update your profile to proceed.");
                return res.redirect("/referrers/" + req.user.username + "/update");
            }
        }
        return;
    }
    req.flash("error", "Your session has expired. Please log in.");
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
            req.flash("error", "Create your institution's profile to proceed.");
            return res.redirect("/hospitals/" + req.user.username + "/details");
        }
    }
    req.flash("error", "Your session has expired. Please log in.");
    res.redirect("/login");
}

middlewareMethods.isHospitalDepartmentCreated = function(req, res, next) {
    if (req.user) {
        if (req.user.role >= 0.75) {
            return next();
        } else {
            if (req.user.role === 0) {
                req.flash("error", "Complete your institution's profile to proceed.");
                return res.redirect("/hospitals/" + req.user.username + "/departments");
            } else if (req.user.role === -1) {
                return res.redirect("/hospitals/" + req.user.username + "/suspended");
            } else {
                req.flash("error", "Complete your institution's profile to proceed.");
                return res.redirect("/hospitals/" + req.user.username + "/details");
            }
        }
    }
    req.flash("error", "Your session has expired. Please log in.");
    res.redirect("/login");
}

module.exports = middlewareMethods;