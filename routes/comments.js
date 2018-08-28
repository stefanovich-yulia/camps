var express = require("express");
var router = express.Router({mergeParams: true}); // access to campgrounds

var Campground  = require("../models/campground"),
    Comment     = require("../models/comment");
var middleware = require("../middleware");
//User = require("./models/user"),


// ----------------------------------------------------------
// COMMENTS ROUTES
// ----------------------------------------------------------


// NEW - show new comment form
router.get("/new", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
      return;
    }
    res.render("comments/new", {campground: campground});
  });
});

// CREATE - post new comment
router.post("/", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
      return;
    }
    Comment.create( req.body.comment, function (err, comment) {
      if (err) {
        console.log(err);
        res.redirect("/campgrounds");
        return;
      }
      // get username
      comment.author.id = req.user._id;
      comment.author.username = req.user.username;
      // save comment
      comment.save(); // save user info
      campground.comments.push(comment);
      campground.save();
      res.redirect("/campgrounds/" + campground._id);
    });
  });
});

// EDIT comment - show edit form
router.get("/:comment_id/edit", middleware.isCommentOwner, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
      console.log(err);
      res.redirect("back");
      return;
    }
    res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
  });
});

// UPDATE comment
router.put("/:comment_id", middleware.isCommentOwner, function(req, res) {
  // find and update comment, then redirect somewhere
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if (err) {
      res.redirect("back");
      console.log(err);
      return;
    }
    res.redirect("/campgrounds/" + req.params.id);
  });
});

// DELETE comment
router.delete("/:comment_id", middleware.isCommentOwner, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect("back");
      return;
    }
    res.redirect("back");
  });
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

function isCommentOwner(req, res, next) {
  // if user is logged ins
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect("back");
        return;
      }
      // does the user own the comment?
      if (foundComment.author.id.equals(req.user._id)) {
        next();
      } else {
        res.redirect("back");
      }

    });
  }
  else res.redirect("back");
}
//-----------------------------------------------------------
module.exports = router;
