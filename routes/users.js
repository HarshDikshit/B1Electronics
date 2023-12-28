const mongoose = require('mongoose');
const plm=require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/boneelectronics");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
   
  },
  password: {
    type: String,
 
  },
  admin: Boolean
});

userSchema.plugin(plm);

// Hash and salt the password before saving


const User = mongoose.model('User', userSchema);

module.exports = User;

