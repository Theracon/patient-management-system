/******************************************************************************************************************************/
// IMPORT DEPENDENCIES & FILES, ASSIGN GLOBAL VARIABLES
/******************************************************************************************************************************/
var express         = require('express'),
    mongoose        = require('mongoose'),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local").Strategy,
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    session         = require("express-session"),
    cookieParser    = require("cookie-parser"),
    flash           = require("connect-flash"),
    path            = require("path"),
    http            = require("http"),
    socketio        = require("socket.io"),
    indexRoutes     = require("./routes/index"),
    adminRoutes     = require("./routes/admin"),
    hospitalRoutes  = require("./routes/hospitals"),
    referrerRoutes  = require("./routes/referrers"),
    patientRoutes   = require("./routes/referrer_patients"),
    profileRoutes   = require("./routes/referrer_profile"),
    User            = require("./models/user");
                      require("dotenv").config({ path: "variables.env" });
/******************************************************************************************************************************/
// CONFIGURE APP
/******************************************************************************************************************************/
// Initialize app
var app = express();

// Set up server
var server = http.createServer(app);

app.use(cookieParser("secret"));
app.use(session({ secret: "wonders", resave: false, saveUninitialized: false }));

// Configure app to use Flash
app.use(flash());

// Configure app to use body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

// Configure passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set current user
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Configure express to use route files
app.use(indexRoutes);
app.use(adminRoutes);
app.use(hospitalRoutes);
app.use(referrerRoutes);
app.use(patientRoutes);
app.use(profileRoutes);

/******************************************************************************************************************************/
// CONNECT MONGOOSE TO DB
/******************************************************************************************************************************/
mongoose.connect('mongodb+srv://admin:admin@mayfielddoc.xd5am.mongodb.net/md1?retryWrites=true&w=majority',
  { useNewUrlParser: true },
  { useUnifiedTopology: true });

/******************************************************************************************************************************/
// SERVER LISTEN ROUTE
/******************************************************************************************************************************/
server.listen(process.env.PORT, function () {
  console.log('Fastclinic Local Server is now Running at Port ' + server.address().port);
});