/******************************************************************************************************************************/
// IMPORT DEPENDENCIES & FILES, DEFINE GLOBAL VARIABLES
/******************************************************************************************************************************/
// Import dependencies
var bodyParser = require('body-parser'),
    express = require('express'),
    cookieParser = require("cookie-parser"),
    flash = require("connect-flash"),
    LocalStrategy = require("passport-local").Strategy,
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    passport = require("passport"),
    session = require("express-session"),

    // Import index route file
    indexRoutes = require("./routes/index"),

    // Import admin route files
    adminIndexRoutes = require("./routes/admin_index"),
    adminInvoiceRoutes = require("./routes/admin_invoice"),
    adminBroadcastRoutes = require("./routes/admin_broadcast"),
    adminSignupRoutes = require("./routes/admin_signup"),
    adminLoginRoutes = require("./routes/admin_login"),
    adminDepartmentRoutes = require("./routes/admin_departments"),
    adminDoctorRoutes = require("./routes/admin_doctors"),
    adminPatientRoutes = require("./routes/admin_patients"),

    // Import department route files
    departmentNotificationsRoutes = require("./routes/department_notifications"),
    departmentReportsRoutes = require("./routes/department_reports"),
    departmentRegisterRoutes = require("./routes/department_register"),
    departmentLoginRoutes = require("./routes/department_login"),
    departmentDashboardRoutes = require("./routes/department_dashboard"),
    departmentInvestigationsRoutes = require("./routes/department_investigations"),
    departmentProfileRoutes = require("./routes/department_profile"),
    departmentBookingsRoutes = require("./routes/department_bookings"),

    // Import referrer route files
    doctorNotificationsRoutes = require("./routes/doctor_notifications"),
    doctorPatientsRoutes = require("./routes/doctor_patients"),
    doctorLoginRoutes = require("./routes/doctor_login"),
    doctorDashboardRoutes = require("./routes/doctor_dashboard"),
    doctorRegisterRoutes = require("./routes/doctor_register"),

    // Import wildcard route file
    wildcardRoute = require("./routes/wildcard"),

    // Import the user model
    User = require("./models/user");

// Import dotenv
require('dotenv').config();


/******************************************************************************************************************************/
// CONFIGURE APP
/******************************************************************************************************************************/
// Initialize app
var app = express();

// Configure app to use cookie-parser
app.use(cookieParser("secret"));

// Configure app to parse json data from request object
app.use(express.json());

// Configure app to use express-session
app.use(session({ secret: "wonders", resave: false, saveUninitialized: false }));

// Configure app to use flash
app.use(flash());

// Configure app to use body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set view engine
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

// Configure app to use passport
app.use(passport.initialize());
app.use(passport.session());

// Configure passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Define the currentUser global variable
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Configure app to use index route file
app.use(indexRoutes);

// Configure app to use admin route files
app.use(adminIndexRoutes);
app.use(adminSignupRoutes);
app.use(adminLoginRoutes);
app.use(adminInvoiceRoutes);
app.use(adminDepartmentRoutes);
app.use(adminDoctorRoutes);
app.use(adminPatientRoutes);
app.use(adminBroadcastRoutes);

// Configure app to use hospital route files
app.use(departmentRegisterRoutes);
app.use(departmentLoginRoutes);
app.use(departmentDashboardRoutes);
app.use(departmentProfileRoutes);
app.use(departmentInvestigationsRoutes);
app.use(departmentBookingsRoutes);
app.use(departmentReportsRoutes);
app.use(departmentNotificationsRoutes);

// Configure app to use referrer route files
app.use(doctorRegisterRoutes);
app.use(doctorLoginRoutes);
app.use(doctorDashboardRoutes);
app.use(doctorPatientsRoutes);
app.use(doctorNotificationsRoutes);

// Configure app to use wildcard route file
app.use(wildcardRoute);


/******************************************************************************************************************************/
// CONNECT MONGOOSE TO DATABASE
/******************************************************************************************************************************/
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true }, { useUnifiedTopology: true });


/******************************************************************************************************************************/
// CONFIGURE APP LISTEN ROUTE
/******************************************************************************************************************************/
var port = Math.round(Math.random() * 1000);
app.listen(3336, function() {
    console.log("My Clinic local server running at port 3336");
});