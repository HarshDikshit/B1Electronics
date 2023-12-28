const mongoose = require('mongoose');






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