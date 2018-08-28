var Campground  = require("../models/campground"),
    Comment     = require("../models/comment");

var middlewareObj = {};

middlewareObj.isCampgroundOwner = function (req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      if (err) {
        res.redirect("back");
        return;
      }
      // does the user own the campground?
      if (foundCampground.author.id.equals(req.user._id)) {
        next();
        //res.render("campgrounds/edit", {campground: foundCampground});
      } else {
        res.redirect("back");
      }

    });
  }
  else res.redirect("back");
}

middlewareObj.isCommentOwner = function (req, res, next) {
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

middlewareObj.isLoggedIn = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}


module.exports = middlewareObj;
