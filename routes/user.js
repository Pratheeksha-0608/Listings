const express=require("express");
const router=express.Router({mergeParams:true});
const User=require("../models/user.js");
const usercontroller=require("../controllers/user.js");
const wrapAsync=require('../utils/wrapAsync.js');
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
router.route("/signup")
.get(usercontroller.rendersignup)
.post(saveRedirectUrl,wrapAsync(usercontroller.signup));
router.route("/login")
.get(usercontroller.renderloginform)
.post(saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),
usercontroller.login)
router.get("/logout",usercontroller.logout
);
module.exports=router;