var express = require('express');
var router = express.Router();
const userModel=require("./users");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("index", {name: "himanshu"});
});

router.get('/createduser', async function(req, res, next) {
  let createdUser = await userModel.create({
   username : "harsh",
   password : "aman"
  });
  res.send(createdUser);
 });


module.exports = router;
