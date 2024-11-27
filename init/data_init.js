const initdataObj = require('./data.js');
const mongoose = require('mongoose');
// requiring Listing model
const Listing = require('../models/listing.js');

const mongoLink = "mongodb://127.0.0.1:27017/wanderlust";
// connection gto database
main()
.then(()=>(console.log('connection success')))
.catch(err => (console.log('error occured in connecting to database\n',err)));

async function main(){
    await mongoose.connect(mongoLink);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initdataObj.data = initdataObj.data.map((obj)=>({...obj,owner : "67455a25c269c7632c07cf9a"}));
    await Listing.insertMany(initdataObj.data);
}
// console.log(initdataObj.data); // return array


initDB()
.then(()=>(console.log('data is intialized')))
.catch(err=>(console.log('error in intializing data ',err)));