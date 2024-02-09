var express = require("express");
var router = express.Router();
const userModel = require("./users");
const session = require("express-session");
//const upload= require('./multer');
const slideModel = require("./slide");
const User = require("./users");
const cors = require("cors");
const localStrategy = require("passport-local");
const passport = require("passport");
passport.use(new localStrategy(userModel.authenticate()));
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const { getAuth, signInAnonymously } = require("firebase/auth");

const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} = require("firebase/storage");
const mongoose = require("mongoose");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const firebase = require("./Firebase");
const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });


mongoose.connect("mongodb+srv://harshdixit15031975:amandixit@cluster0.jzb6fgz.mongodb.net/?retryWrites=true&w=majority")
.then(()=>
{
  console.log("great");
}).catch((err) => console.log("wrong")); 
/*
mongoose.connect("mongodb://127.0.0.1:27017/boneelectronics"); */

router.use(cors());

// auth middleware
const auth = getAuth();

// GET home pagenpx nodemon

router.get("/", async function (req, res, next) {
  signInAnonymously(auth)
    .then(() => {
      console.log("success");
    })
    .catch((err) => {
      console.log(err);
    });

  var posts = await slideModel.find();

  res.render("index", { posts });
});

//checking for logged in user
function isLoggedIn(req, res, next) {
  /* if(req.session.username){
   
    req.session.destroy();

    //linking admin page
   return next();
   }
   res.redirect("/login") */

  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// get admin route
router.get("/admin", isLoggedIn, async function (req, res, next) {
  console.log(req.session.passport.user);

  var posts = await slideModel.find();

  res.render("admin", { posts });
});

// get register route

router.get("/register", function (req, res, next) {
  res.render("register");
});

// post on register button clicked
router.post("/register", async function (req, res, next) {
  var userdata = new userModel({
    username: req.body.username,
    admin: false,
  });
  userModel.register(userdata, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/");
    });
  });
});

//get login route

router.get("/login", function (req, res, next) {
  res.render("login", { name: "himanshu" });
});

//post login button click

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

router.get("/project", function (req, res, next) {
  res.send("lets build together this page");
});

// post data creation through admin panel

router.post(
  "/updateslide",
  upload.single("imageFile"),
  isLoggedIn,
  async function (req, res) {
    if (req.body.token != "select") {
      if (req.file) {
        const unique = uuidv4() + path.extname(req.file.originalname);
        if (!req.body.token == "") {
          var storageRef = ref(storage, req.body.token + "/" + unique);
        
        
        var uploadTask = uploadBytes(storageRef, req.file.buffer);
        uploadTask.then(() => {
          getDownloadURL(storageRef)
            .then(async (url) => {
              console.log("file uploaded");
              var fbLink = url;
              const imgSlide = await slideModel.create({
                imageUrl: unique,
                link: fbLink,
                token: req.body.token,
                description: req.body.description,
                username: req.session.passport.user,
              });
              res.redirect("/admin");
            })
            .catch((err) => {
              console.log(err);
            });
        });
    }  } else {
        const imgSlide = await slideModel.create({
          /*  imageUrl: "", */
          link: req.body.link,
          token: req.body.token,
          description: req.body.description,
          username: req.session.passport.user,
        });
      }
    } else {
      res.send("kindly fill token field");
    }
    res.redirect("/admin");
  }
);

//get delete posts
router.get("/delete/:id", async function (req, res, next) {
  //find and delete

  const db = await slideModel.findById({
    _id: req.params.id,
  });

  const deleteRef = ref(storage, db.token + "/" + db.imageUrl);
  deleteObject(deleteRef)
    .then(() => {
      console.log("file deleted");
    })
    .catch((err) => {
      console.log(err);
    });
  const slide = await slideModel.findByIdAndDelete({
    _id: req.params.id,
  });

  //check for server side images delete
  res.redirect("/admin");
});

module.exports = router;
