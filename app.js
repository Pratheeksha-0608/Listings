if(process.env.NODE_ENV!="production"){
require('dotenv').config();
}
const express=require("express");
const app=express();
const path=require("path");
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const ejsMate = require('ejs-mate');
const wrapAsync=require('./utils/wrapAsync.js');
const Expresserror=require('./utils/expresserror.js');
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, '/public')));
const methodOverride = require('method-override');
app.engine('ejs', ejsMate);
app.use(methodOverride('_method'))
const mongoose = require("mongoose");
const Listing=require("./models/listing.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const flash = require('connect-flash');
const Review=require("./models/review.js");
const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js");
const passport= require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const userRouter=require("./routes/user.js");
const session=require('express-session');
const {MongoStore}=require('connect-mongo');
const dbUrl=process.env.ATLASDB_URL;
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",(err)=>{
    console.log("Error in mongo session store",err);
});
const sessionOption={
    store:store,
    resave:false,
    secret:process.env.SECRET,
    saveUninitialized:false,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user||null;
    next();
});
main().then(()=>{
    console.log("Connection was successful");
})
.catch((err)=>{
    console.log(err);
});
app.use((req, res, next) => {
    console.log("curruser:", res.locals.curruser);
    next();
});
async function main(){
await mongoose.connect(dbUrl);
}
app.use("/",userRouter);
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.listen(8080,(req,res)=>{
    console.log("Running");
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render('error.ejs',{message});
});
// app.get('*', (req, res,next) => {
//   next(new Expresserror(404,"Page Not found"));
// }); 






