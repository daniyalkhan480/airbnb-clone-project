const Listing = require("../models/listing.js");

module.exports.index = async(req,res)=>{
    let listings = await Listing.find();
    res.render('index.ejs',{listings});
};


// new form function
module.exports.renderNewForm = (req,res)=>{
    res.render('new.ejs');
};


module.exports.createListing = async (req,res,next)=>{
    let {listing} = req.body;
    if(req.file){
        let {path,filename}=req.file;
        listing.image = {url : path , filename : filename};
    }
    listing.owner = req.user._id;

    let list = new Listing(listing);
    req.flash('success',"Listing has been added");
    let result = await list.save();
    let id = result.id;
    res.redirect(`/listings/${id}`);
};


module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
        req.session.redirectUrl = `/listings/${id}`;
    let list  =await Listing.findById(id)
                            .populate({
                                path : "reviews",
                                populate : {path : "author"}
                            })
                            .populate("owner");                      
    if(!list){
        req.flash("error","Listing does not exist or either has been deleted.");
        res.redirect('/listings');
    }else{
        res.render('show.ejs',{list});
    }
};


module.exports.renderEditForm = async (req,res,next)=>{
    let {id} = req.params;
    let list=await Listing.findById(id).populate("owner");
    if(!list){
        req.flash("error","Listing does not exist or either has been deleted.");
        res.redirect('/listings');
    }
    res.render('edit.ejs',{list})
};


module.exports.editListing = async (req,res,next)=>{
  
    let {id} = req.params;
    let {listing} = req.body;
    let list = await Listing.findByIdAndUpdate(id,{...listing});
    // to save a new Image if user update
    if(req.file){
        let {path,filename}= req.file;
        list.image = {url : path,  filename : filename};
        await list.save(); // save list with new image
    }

    req.flash("success","Listing has been edited successfully");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;

    let result = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing has been deleted");
    // console.log('listing deleted',result);
    res.redirect(`/listings`);
};