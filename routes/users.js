const mongoose = require('mongoose');


mongoose.connect("mongodb://127.0.0.1:27017/boneelectronics");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
   
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash and salt the password before saving


const User = mongoose.model('User', userSchema);

module.exports = User;
