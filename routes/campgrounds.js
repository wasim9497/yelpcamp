var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


router.get("/", function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
    } else {
        res.render("campground/index",{campgrounds:allCampgrounds});
    }
});
});
//create - add new campground
router.post("/", middleware.isLoggedIn, function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username:req.user.username
    }
    var newCampground = {name: name, image: image,description: desc, author: author}
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        } else {
          res.redirect("/campgrounds");  
        }
    
    });
});
//new-show form to create new campground
router.get("/new" , middleware.isLoggedIn, function(req, res){
    res.render("campground/new");
});
//shows-more info of campgrounds
router.get("/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
      if(err || !foundCampground){
            req.flash("error","campground not found");
             res.redirect("back");
        } else {  
            console.log(foundCampground)
 res.render("campground/show", {campground: foundCampground});
        }
});
});
//edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
    res.render("campground/edit", {campground: foundCampground});
});
});
//update
router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
         res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
//delete
router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function (err){
        if(err){
        res.redirect("/campgrounds");
        } else {
         res.redirect("/campgrounds");
    }
    });
});
module.exports = router;