var express = require("express");
var router = express.Router();

var Campground  = require("../models/campground");
    //Comment     = require("../models/comment");
var middleware = require("../middleware"); // write index.js is not nesessary - it's main file 

// ----------------------------------------------------------
// CAMPGROUNDS ROUTES
// ----------------------------------------------------------

// show all campgrounds
router.get("/", function(req, res) {
  Campground.find({}, function(err, campgrounds) {
    if (err) {
      console.log(err);
      return;
    }
    res.render("campgrounds/index", {campgrounds:campgrounds, currentUser: req.user})
  });
});

// create
router.post("/", middleware.isLoggedIn, function(req, res) {
  Campground.create( {
    name: req.body.name,
    image: req.body.image,
    author: {
              id: req.user._id,
              username: req.user.username
            },
    description: req.body.description
  },
  function(err, created) {
    if (err) {
      console.log("Something went wrong");
      console.log(err);
    }
    else {
      console.log("Object added succesfully");
      console.log(created);
    }
  })
  res.redirect("/campgrounds");
});

// new form
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

// show concrete campground
router.get("/:id", function(req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if (err) {
      console.log(err);
      return;
    }
    res.render("campgrounds/show", {campground:foundCampground});
  });
});


// EDIT campground
router.get("/:id/edit", middleware.isCampgroundOwner, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});
// UPDATE campground
router.put("/:id", middleware.isCampgroundOwner, function(req, res) {
  // find and update camp, then redirect somewhere
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
    if (err)
    {
      res.redirect("/campgrounds");
      console.log("Something went wrong:" + err);
      return;
    }
    res.redirect("/campgrounds/" + req.params.id);
  });
});

// DELETE campground
router.delete("/:id", middleware.isCampgroundOwner, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/campgrounds");
      return;
    }
    res.redirect("/campgrounds");
  });
});

module.exports = router;
