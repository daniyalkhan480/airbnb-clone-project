const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedIn,validateListing,isOwner} = require("../utils/middlewares.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});





router
.route('/')
// Rendering index Index Route
.get(wrapAsync(listingController.index))
// adding new listing
.post(isLoggedIn
        ,upload.single('listing[image]')        
        ,validateListing        
        ,wrapAsync(listingController.createListing));

// rendering new page
router.get('/new',isLoggedIn,listingController.renderNewForm);


router
.route('/:id')
// Show Listing : Rendering specific list on click
.get(wrapAsync(listingController.showListing))
// updating database accordingly edit request
.post(isLoggedIn
        ,isOwner
        ,upload.single('listing[image]')   
        ,validateListing,wrapAsync(listingController.editListing))
// deleting Listing
.delete(isLoggedIn
        ,isOwner
        ,wrapAsync(listingController.destroyListing));


// Rendering edit page 
router.get('/:id/edit'
            ,isLoggedIn
            ,isOwner
            ,wrapAsync(listingController.renderEditForm));






module.exports = router;