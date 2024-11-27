const Joi = require('joi');


const listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        price : Joi.number().required().min(0),
        location : Joi.string().required(),
        country : Joi.string().required(),

        image : Joi.object({
            filename : Joi.string(),
            url : Joi.string().allow(null,"")
        })

    }).required(),

});

module.exports.listingSchema = listingSchema;


// review validation joi schema

const reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required(),
        comments : Joi.string().required(),
    }).required(),
});

module.exports.reviewSchema = reviewSchema;
