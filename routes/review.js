const express = require('express');
const router = express.Router({mergeParams : true});

const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedIn,validateReview, isReviewAuthor} = require("../utils/middlewares.js");

const reviewController = require("../controllers/review.js");


// Saving Reviews to database One to many
router.post('/'
            ,isLoggedIn
            ,validateReview
            ,wrapAsync(reviewController.createReview));

// deleting a review
router.delete('/:reviewId'
                ,isLoggedIn
                ,isReviewAuthor
                ,wrapAsync(reviewController.destroyReview));

module.exports =  router;