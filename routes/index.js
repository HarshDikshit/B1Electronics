var express = require('express');
var router = express.Router();
const userModel=require("./users");
const session=require('express-session');
const upload= require('./multer');
const slideModel= require("./slide");
const User = require('./users');

const localStrategy= require("passport-local");
const passport = require('passport');
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', async function(req, res, next) {
  var posts= await slideModel.find();

  res.render("index", {posts});
 
});




//checking for logged in user
function isLoggedIn(req, res, next){
 /* if(req.session.username){
   
    req.session.destroy();

    //linking admin page
   return next();
   }
   res.redirect("/login") */

   if(req.isAuthenticated()){
    return next();
   }
   res.redirect("/login"); 
}

//admin route
router.get('/admin', isLoggedIn, async function(req, res, next) {
console.log(req.session.passport.user)

var posts= await slideModel.find();

res.render('admin', {posts});
})

router.get('/', async function(req, res, next) {
  var posts= await slideModel.find();

 res.render('index',{posts});

});
//register

router.get('/register', function(req, res, next){
  res.render("register");

});

router.post('/register', async function (req, res ,next){
  var userdata= new userModel({
    username: req.body.username,
    admin: false 
  
  });
  userModel.register(userdata, req.body.password).then( function(){
    passport.authenticate("local")(req, res, function(){
      res.redirect('/');
    })
  })
})   
 
//login route 
 
router.get('/login', function(req, res, next) {
 res.render("login", {name: "himanshu"});
});

/*
router.post('/login', async function(req, res, next) {

 if(await userModel.findOne({username : req.body.username,
password: req.body.password})){ 
  let user= await  userModel.findOne({username : req.body.username});
  req.session.username= user.username;
  res.redirect('/admin');
}else{
 res.send("error"); 
}
});*/


router.post("/login", passport.authenticate("local",{
 
  successRedirect: "/admin",
  failureRedirect: "/login"
}), function(req, res){});

router.get("/project", function(req, res, next){
  res.send("lets build together this page");
});

//admin 

router.post('/updateslide', upload.single('image') , isLoggedIn, async function(req,res){
 /* var user= await userModel.findOne({
    username: req.session.passport.username
  })*/
  
 if(req.file && req.body.token=="slide"){
  const imgSlide= await slideModel.create({
  imageUrl: req.file.filename,
  token: req.body.token,
  description: req.body.description,
  username: req.session.passport.user
})
res.redirect('/admin');

}else if(req.body.token=="update" && req.body.link != ""){
  const imgSlide= await slideModel.create({
    link: req.body.link,
    token: req.body.token,
    description: req.body.description,
    username: req.session.passport.user
  })
  res.redirect('/admin');
}else{
  
  
  res.redirect('/admin');
}

});

router.get('/delete/:id', async function(req, res,next){
  await slideModel.findByIdAndDelete({
    _id: req.params.id
  })
  res.redirect('/admin');
})
 
module.exports = router; 
