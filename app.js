/******************************************************************************************************************************/
// IMPORT DEPENDENCIES & FILES; DEFINE GLOBAL VARIABLES
/******************************************************************************************************************************/
// Import dependencies
var express = require('express'),
    mongoose = require('mongoose'),
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require("express-session"),
    cookieParser = require("cookie-parser"),
    flash = require("connect-flash"),

    // Import route files
    indexRoutes = require("./routes/index"),
    adminIndexRoutes = require("./routes/admin_index"),
    adminBroadcastRoutes = require("./routes/admin_broadcast"),
    adminHospitalRoutes = require("./routes/admin_hospitals"),
    adminReferrerRoutes = require("./routes/admin_referrers"),
    hospitalIndexRoutes = require("./routes/hospital_index"),
    hospitalAuthenticateRoutes = require("./routes/hospital_authentication"),
    hospitalDeactivateRoutes = require("./routes/hospital_deactivate"),
    hospitalDepartmentsRoutes = require("./routes/hospital_departments"),
    hospitalNotificationsRoutes = require("./routes/hospital_notifications"),
    hospitalPatientsRoutes = require("./routes/hospital_patients"),
    hospitalProceduresRoutes = require("./routes/hospital_procedures"),
    hospitalProfileRoutes = require("./routes/hospital_profile"),
    referrerIndexRoutes = require("./routes/referrer_index"),
    referrerDeactivateRoutes = require("./routes/referrer_deactivate"),
    referrerNotificationsRoutes = require("./routes/referrer_notifications"),
    referrerPatientsRoutes = require("./routes/referrer_patients"),
    referrerProfileRoutes = require("./routes/referrer_profile"),

    // Import the user model
    User = require("./models/user");

// Import dotenv
require('dotenv').config();


/******************************************************************************************************************************/
// CONFIGURE APP
/******************************************************************************************************************************/
// Initialize and set up app
var app = express();

app.use(cookieParser("secret"));
app.use(session({ secret: "wonders", resave: false, saveUninitialized: false }));

// Configure app to use Flash
app.use(flash());

// Configure app to use body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set view engine
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

// Configure passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set the currentUser variable
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

/******************************************************************************************************************************/
// Configure express to use route files
/******************************************************************************************************************************/
// Use admin route files
app.use(adminIndexRoutes);
app.use(adminBroadcastRoutes);
app.use(adminHospitalRoutes);
app.use(adminReferrerRoutes);

// Use hospital route files
app.use(hospitalIndexRoutes);
app.use(hospitalAuthenticateRoutes);
app.use(hospitalDeactivateRoutes);
app.use(hospitalDepartmentsRoutes);
app.use(hospitalNotificationsRoutes);
app.use(hospitalPatientsRoutes);
app.use(hospitalProceduresRoutes);
app.use(hospitalProfileRoutes);

// Use referrer route files
app.use(referrerIndexRoutes);
app.use(referrerDeactivateRoutes);
app.use(referrerNotificationsRoutes);
app.use(referrerPatientsRoutes);
app.use(referrerProfileRoutes);

// Use index route file
app.use(indexRoutes);


/******************************************************************************************************************************/
// CONNECT MONGOOSE TO DATABASE
/******************************************************************************************************************************/
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true }, { useUnifiedTopology: true });


/******************************************************************************************************************************/
// APP LISTEN ROUTE
/******************************************************************************************************************************/
app.listen(process.env.PORT, function() {
    console.log(`Fastclinic Local Server is now Running at Port ${process.env.PORT}`);
});