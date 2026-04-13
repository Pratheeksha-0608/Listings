const User=require("../models/user");
module.exports.rendersignup=(req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.signup=async (req,res,next)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const reguser=await User.register(newUser,password);
    req.login(reguser,(err)=>{
        if(err)return next(err);
        req.flash("success","Welcome");
        res.redirect("/listings");
    });
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
};
module.exports.renderloginform=(req,res)=>{
    res.render("users/login.ejs");
};
module.exports.login=async (req,res)=>{
    req.flash("success","Welcome");
    let redirectUrl=res.locals.redirectURl||"/listings";
    res.redirect(redirectUrl);
};
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err)return next(err);
        req.flash("success","Logged out");
        res.redirect("/listings");
    }
    );

}