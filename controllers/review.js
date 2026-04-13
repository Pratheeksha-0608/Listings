const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
module.exports.createreview=async(req,res)=>{
let listing=await Listing.findById(req.params.id);
let newReview=new Review(req.body.review);
newReview.author=req.user._id;
listing.reviews.push(newReview);
await newReview.save();
await listing.save();
req.flash("success","Review created");
res.redirect(`/listings/${listing._id}`);
};
module.exports.destroyreview=async (req,res)=>{
    let {id,reviewid}=req.params;
    await Review.findByIdAndDelete(reviewid);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    req.flash("success","Review deleted!");
    res.redirect(`/listings/${id}`);
};