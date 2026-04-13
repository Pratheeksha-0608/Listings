const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');
const Review=require("../models/review.js");
const {validateReview,isloggedin,isauthor}=require("../middleware.js");
const reviewcontroller=require("../controllers/review.js");
// Post review route
router.post("/",isloggedin,validateReview,wrapAsync(reviewcontroller.createreview));
// Review delete
router.delete("/:reviewid",isloggedin,isauthor,wrapAsync(reviewcontroller.destroyreview));
module.exports=router;