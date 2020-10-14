const express = require('express');
let router = express.Router({mergeParams: true});

let Campground = require("../models/campground");
let Comment = require("../models/comment");

const middleware = require("../middleware");

//New Comment Form
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

//Adding new Comment
router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.data, (err, comment) => {
                if(err) {
                    console.log(err);
                } else {
                    //Add Username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});

//Editing Form of Comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    // res.send("Heya");
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//Comment Edited
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    // let newComment = {
    //     text: req.body.comment,
    // }
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

module.exports = router;