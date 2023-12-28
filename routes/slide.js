const mongoose = require('mongoose');


mongoose.connect("mongodb://127.0.0.1:27017/boneelectronics");



const imageSlide= new mongoose.Schema({
    imageUrl: String,
    username: String,
    description: String,
    token: String,
    link: String,
    date: {
        type: Date,
        default: Date.now,

    }
   });
   
   module.exports= mongoose.model('image', imageSlide);