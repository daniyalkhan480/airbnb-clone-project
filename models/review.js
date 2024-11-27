const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// defining schema
const reviewSchema = mongoose.Schema({
    comments : {
        type : String,
        required : true 
    },

    rating : {
        type : Number,
        required : true
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    }
});

// review Model
const Review = mongoose.model("Review",reviewSchema);

module.exports = Review;