if(process.env.NODE_ENV != 'production'){
    require("dotenv").config();
}
const express = require('express');
const app = express(); 
const path = require('path');
// const mongoLink = "mongodb://127.0.0.1:27017/wanderlust";
const dbLink = process.env.MONGO_ATLAS_URL;



// installed packages
const mongoose = require ('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const passport = require ("passport");
const LocalStrategy = require ("passport-local");
const User = require('./models/user.js');





// Own created packages
const ExpressError = require('./utils/ExpressError.js');
const listingRoutes = require('./routes/listing.js'); 
const reviewRoutes = require('./routes/review.js'); 
const userRoutes = require("./routes/user.js");


const store = MongoStore.create({
    mongoUrl : dbLink,
    crypto : {
        secret : "mysecretstring"
    },
    touchAfter : 24*3600,
});
// Seesion options
const sessionOptions = {
    store : store,
    secret : "mysecretstring",
    resave : false,
    saveUninitialized :true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true
    }
}

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
// using express sesssion
app.use(cookieParser());
app.use(session(sessionOptions));
app.use(flash());

// after express.session configuring passport
app.use(passport.initialize());
app.use(passport.session());

// setting strategy to local
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middle ware to pass flash message as locals
// defining local variables
app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error=req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.engine('ejs', ejsMate);



// connection gto database
main()
.then(()=>(console.log('connection success')))
.catch(err => (console.log('error occured in connecting to database\n',err)));

async function main(){
    await mongoose.connect(dbLink);
}


// // root page
// app.get('/',(req,res)=>(res.send('This is root page')));

// adding listing routes using router
app.use('/listings',listingRoutes);
app.use('/listings/:id/reviews',reviewRoutes);
app.use("/",userRoutes);


// Invalid Route Exccess
app.all('*',(req,res,next)=>{
    next(new ExpressError(404, 'page not found'))
    // res.send('page not found');
})

// Error Handling MiddleWare
app.use((err,req,res,next)=>{
    let {statusCode=500,message='Something went wrong. Internal Server Error'} =err;
    res.render('error.ejs',{message});
});

// listening servver request
app.listen(8080,()=>console.log('listening at port 8080'));




  // checking if req body is not null ====>covered by middle ware function =>alidateListing
//   if(!req.body.listing || !req.body.image) {
//     throw new ExpressError(400,'Send valid data for listing');
// }