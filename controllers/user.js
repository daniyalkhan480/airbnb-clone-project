const User = require("../models/user.js");


module.exports.renderSignupForm = (req,res)=>{
    res.render('signup.ejs');
};


module.exports.signup = async(req,res)=>{
    let {username,email,password} =  req.body;
    try{
        let newUser = new User({
            username : username,
            email : email
        });

        // saving to db
        let regUser = await User.register(newUser,password);
        // automatically logging in registered user after signup
        req.logIn(regUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WanderLust");
            res.redirect(res.locals.redirectUrl);
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect('/signup');
    }
};


module.exports.renderLoginForm = (req,res)=>{
    res.render("login.ejs");
};


module.exports.login = (req,res)=>{
    // user session info
    req.flash("success","Welcome back to Wanderlust");
    res.redirect(res.locals.redirectUrl);

};


module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully");
        res.redirect("/listings");
    })
};