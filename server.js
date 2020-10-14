const express           = require('express');
const app               = express();
const bodyParser        = require('body-parser');
const mongoose          = require('mongoose');
const passport          = require('passport');
const LocalStrategy     = require('passport-local');
const methodOverride    = require('method-override');
const flash             = require("connect-flash")

const User              = require("./models/user");
const seedDB            = require('./seeds');

const commentRoutes     = require('./routes/comments'),
      campgroundRoutes  = require('./routes/campgrounds'),
      indexRoutes       = require('./routes/index');

mongoose.connect(process.env.DATABASEURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride("_method"));
app.use(flash());

//Seeding DB
// seedDB();


//Passport Config
app.use(require('express-session')({
    secret: "Executer",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Sending User Info to all templates
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//PORT for files
let PORT = process.env.PORT || 3000;

//Server Setup
app.listen(PORT, ()=> {
    console.log(`YelpCamp server started at ${PORT}`);
});