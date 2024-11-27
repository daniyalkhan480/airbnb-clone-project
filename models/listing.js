const mongoose = require('mongoose');
const Review = require('./review.js');
const Schema  = mongoose.Schema;

const listngSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true
    },
    description: String,
    image: {
      filename: {type : String , default : "listingimage"},
      url: {  type : String ,
              default : "https://plus.unsplash.com/premium_photo-1682377521753-58d1fd9fa5ce?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bHV4dXJ5JTIwdmlsbGF8ZW58MHx8MHx8fDA%3D", 
              
              set:(v)=> v==="" ? "https://plus.unsplash.com/premium_photo-1682377521753-58d1fd9fa5ce?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bHV4dXJ5JTIwdmlsbGF8ZW58MHx8MHx8fDA%3D" : v
            },
    },
    price: Number,
    location: String,
    country: String,

    // creating review array object
    reviews : [{
      type : Schema.Types.ObjectId,
      ref : "Review"
    }],

    // storing listing owner
    owner : {
      type : Schema.Types.ObjectId,
      ref : "User",
      required : true
    }
});

// definig middle
listngSchema.post('findOneAndDelete',async(listingDoc)=>{
  // console.log('Mongooose Middle');
  if(listingDoc){
    // console.log(listingDoc);
    await Review.deleteMany({_id : {$in : listingDoc.reviews}});  // {$in : array}
  }
});

const Listing = mongoose.model('Listing',listngSchema);

module.exports = Listing;