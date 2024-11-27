const {listingSchema,reviewSchema} = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require("../models/listing.js");
const Review = require('../models/review.js');
const wrapAsync = require('./wrapAsync.js');


// wrriting validating function to be used in middleware
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,`${error.details[0].type} : --> ${error.message}`);
    }else{
        next();
    }
};
// wrriting validating function to be used in middleware
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,`${error.details[0].type} : --> ${error.message}`)
    }else{
        next();
    }
};
// creating a middle ware to check if user is login in user 
module.exports.isLoggedIn= (req,res,next)=>{
    if(!req.isAuthenticated()){
        // only need to store when user is not logged in
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "User need to be logged in first");
        return res.redirect("/login");
    }
    next();
}

// middle to remember the url since passport login wil change the session info
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        // ghatya traiqa API REQUEST ERROR control karnay
        let url = req.session.redirectUrl;
        url = url.length>34 ? url.substring(0,34) : url;    
        res.locals.redirectUrl = url;
    }else{
        res.locals.redirectUrl = "/listings";
    }
    next();
};


module.exports.isOwner = wrapAsync(async(req,res,next)=>{
    let {id} = req.params;
    let list  =await Listing.findById(id).populate("owner");
    if(req.user._id.equals(list.owner._id)){
        return next();
    }else{
        req.flash("error","Only owner is allowed to modify/delete Listing");
        res.redirect(`/listings/${id}`);
    }
});

module.exports.isReviewAuthor = wrapAsync(async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review  =await Review.findById(reviewId).populate("author");
    if(req.user._id.equals(review.author._id)){
        return next();
    }else{
        req.flash("error","Only owner is allowed to modify/delete Listing");
        res.redirect(`/listings/${id}`);
    }
});