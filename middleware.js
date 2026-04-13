const Listing=require("./models/listing.js");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
const Expresserror=require('./utils/expresserror.js');
module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to add");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
}
next();
}
module.exports.isowner=async (req,res,next)=>{
    let {id}=req.params;
        let listing=await Listing.findById(id);
        if(!listing.owner.equals(res.locals.curruser._id)){
            req.flash("error","You don't have permission to edit");
            return res.redirect(`/listings/${id}`);
        }
        next();
};
module.exports.validatelisting=(req,res,next)=>{
let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",")
        throw new Expresserror(404,errmsg);
    }
    else{
        next();
    }
}
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",")
        throw new Expresserror(404,errmsg);
    }
    else{
        next();
    }
}
module.exports.isauthor=async (req,res,next)=>{
    let {id,reviewid}=req.params;
        let review=await Review.findById(reviewid);
        console.log(review);
        if(!review.author.equals(res.locals.curruser._id)){
            req.flash("error","You are not the author of this review");
            return res.redirect(`/listings/${id}`);
        }
        next();
};