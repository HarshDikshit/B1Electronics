var express = require('express');
var router = express.Router();
const userModel=require("./users");
const session=require('express-session');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("index", {name: "himanshu"});
});

router.use(session({
  resave: false,
  saveUnitialized: false,
  secret:"ghvvhvhbbj"
}));


//checking for logged in user
function isLoggedIn(req, res, next){
  if(req.session.username){
   
    req.session.destroy();

    //linking admin page
   return next();
   }
   res.redirect("/login")
};

//admin route
router.get('/admin', isLoggedIn, function(req, res, next) {

  res.render("admin");
   
});


//login route
router.get('/login', function(req, res, next) {
  res.render("login", {name: "himanshu"});
});


router.post('/login', async function(req, res, next) {

 if(await userModel.findOne({username : req.body.username,
password: req.body.password})){ 
  let user= await userModel.findOne({username : req.body.username});
  req.session.username= user.username;
  res.redirect('/admin');
}else{
 res.send("error");
}


});


module.exports = router;
