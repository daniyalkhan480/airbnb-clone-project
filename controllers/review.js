const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createReview = async(req,res)=>{

    let data = req.body.review;
    data.author = req.user._id;
    let list = await Listing.findById(req.params.id);
    // creating review object using REVIEW MODEL
    let newReview = new Review(data);
    // saving to listing as well as review collection
    await list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    req.flash("success","New review has been added");
    res.redirect(`/listings/${req.params.id}`);
};



module.exports.destroyReview= async(req,res)=>{
    let {id,reviewId}=req.params;
    // deleting review from reviews collection
    let result = await Review.findByIdAndDelete(reviewId);
    // pull all the instance in listing that matches in review array with the reviewId
    let list = await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    req.flash("success", "Review has been deleted");
    res.redirect(`/listings/${id}`);

};