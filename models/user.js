// const { required } = require('joi');
const mongoose = require('mongoose');
const passportLocalMongoose = require ("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    // passport will automatically add username and password
    email : {
        type : String,
        required : true
    }
});

userSchema.plugin(passportLocalMongoose);

// exporting user model
module.exports = new mongoose.model("User",userSchema);