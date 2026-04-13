const wrapAsync=require('../utils/wrapAsync.js');
const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index=async (req,res)=>{
    const alllistings=await Listing.find({});
    res.render('listings/index',{alllistings});
};
module.exports.rendernewform=(req,res)=>{
    res.render('listings/new.ejs');
};
module.exports.showlisting=async (req,res)=>{
    let id=req.params._id;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author",
    },}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exit");
        res.redirect("/listings");
    }
    res.render('listings/show',{listing});
};
module.exports.createlisting=async (req,res,next)=>{
let response=await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send()
    if(!req.file){
        req.flash("error","Please upload an image");
        return res.redirect("/listings/new");
    }
    
    let url=req.file.secure_url;
    let filename=req.file.public_id;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    newlisting.geometry=response.body.features[0].geometry;
    const savedListing=await newlisting.save();
    if(!savedListing){
        throw new Error("Listing failed to save");
    }
    req.flash("success","New listing created!");
    res.redirect('/listings');
};
module.exports.rendereditform=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
     if(!listing){
        req.flash("error","Listing does not exist");
        return res.redirect("/listings");
    }
    let originalimage=listing.image.url;
    originalimage=originalimage.replace("/upload","/upload/w_250");
    res.render('listings/edit',{listing,originalimage});
};
module.exports.updatelisting=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
    let url=req.file.secure_url;
    let filename=req.file.public_id;
    listing.image={url,filename}; 
    await listing.save();
    }
    req.flash("success","Updated the listing");
    res.redirect('/listings');
};
module.exports.destroylisting=async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findOneAndDelete({_id:id});
    req.flash("success","Listing deleted");
    res.redirect("/listings");
};