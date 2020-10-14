const express = require('express');
let router = express.Router();

const passport = require('passport');

let User = require("../models/user");

//Landing Page
router.get("/", (req, res) => {
    res.render("landing");
});


//Sign Up Form
router.get('/register', (req, res) => {
    res.render('register');
});

//Sign Up
router.post('/register', (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect('/campgrounds');
        });
    });
});

//Login Form
router.get('/login', (req, res) => {
    res.render('login');
});

//Login
router.post('/login',
    passport.authenticate("local",{
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    (req, res) => {
        res.send("Logged In");
});

//Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash("error", "Logged You Out");
    res.redirect('/campgrounds');
});

module.exports = router;