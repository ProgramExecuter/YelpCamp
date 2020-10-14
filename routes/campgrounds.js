const express = require('express');
const campground = require('../models/campground');
let router = express.Router();

let Campground = require("../models/campground");

const middleware = require("../middleware");

//Campgrounds Page
router.get("/", (req, res) => {
    //Get all campground from DB
    Campground.find({}, (err, foundCampground) => {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: foundCampground});
        }
    });
});

//New Campground Add
router.post("/", middleware.isLoggedIn, (req, res) => {
    let newCampground = {
        name: req.body.data.name,
        price: req.body.data.price,
        image: req.body.data.image,
        description: req.body.data.description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }
    Campground.create(newCampground, (err, newlyCreated) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//New Campground Form
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

//Campground Show Page
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//Campground Editing Form
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err) {

        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

//Update the Campground
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findOneAndUpdate(req.params.id, req.body.data, (err, updatedCampground) => {
        if(err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
});

//Destroy Campground
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;