const Campground    = require("../models/campground"),
      Comment       = require("../models/comment");

let middlewareObj = {};

middlewareObj.checkCampgroundOwnership =  function(req, res, next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if(err) {
                req.flash("error", "Campground Not Found")
                console.log(err);
                res.redirect('back');
            } else {
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.send("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                console.log(err);
                res.redirect('back');
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.send("back");
                }
            }
        });
    } else {
        res.redirect("/login");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}

module.exports = middlewareObj;