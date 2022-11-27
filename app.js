//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const homeStartingContent = "";
const aboutContent =
  "Welcome to FIND TUTOR here the students  can find local tutors, online teachers, and teachers to help with tutoring, coaching, assignments, academic projects, and dissertations any subjects.";
const imgUrl = "";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "Our little Secret.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/findTutorDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);

const postSchema = new mongoose.Schema({
  name: String,
  subject: String,
  email: String,
  fee: String,
  difficulty: String,
  content: String,
});

// UserSchema

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

const Post = mongoose.model("Post", postSchema);

const reviewSchema = new mongoose.Schema({
  name: String,
  image: String,
  con: String,
});
const Review = new mongoose.model("Review", reviewSchema);

var userName = "";
app.get("/", function (req, res) {
  if (req.isAuthenticated()) {
    Review.find({}, function (err, posts) {
      res.render("home", { currentUser: userName, posts: posts });
    });
  } else {
    res.redirect("/login");
  }
});
app.get("/maths", function (req, res) {
  if (req.isAuthenticated()) {
    Post.find({ subject: "Maths" }, function (err, posts) {
      res.render("maths", {
        posts: posts,
      });
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/physics", function (req, res) {
  if (req.isAuthenticated()) {
    Post.find({ subject: "Physics" }, function (err, posts) {
      res.render("physics", {
        posts: posts,
      });
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/chemistry", function (req, res) {
  if (req.isAuthenticated()) {
    Post.find({ subject: "Chemistry" }, function (err, posts) {
      res.render("chemistry", {
        posts: posts,
      });
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/biology", function (req, res) {
  if (req.isAuthenticated()) {
    Post.find({ subject: "Biology" }, function (err, posts) {
      res.render("biology", {
        posts: posts,
      });
    });
  } else {
    res.redirect("/login");
  }
});

app.delete("/delete",function(req,res){
Review.deleteOne({
  name: "Iqbal Khan",
})
  .then(function () {
    console.log("Data deleted"); // Success
  })
  .catch(function (error) {
    console.log(error); // Failure
  });
  res.send("Data Deleted");
})

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        userName = req.body.username;
        console.log(userName);
        passport.authenticate("local")(req, res, function () {
          res.redirect("/");
        });
      }
    }
  );
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", function (req, res) {
  const user = new User({
    email: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (err) {
    if (err) {
      console.log(err);
      res.redirect("/login");
    } else {
      userName = req.body.username;
      console.log(userName);
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      });
    }
  });
});

app.get("/logout", (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

app.get("/compose", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("compose");
  } else {
    res.redirect("/login");
  }
});

app.post("/compose", function (req, res) {
  var subject = req.body.postSubject;

  const post = new Post({
    name: req.body.postName,
    subject: req.body.postSubject,
    email: req.body.postEmail,
    fee: req.body.postFee,
    difficulty: req.body.postDifficulty,
    content: req.body.postBody,
  });
  post.save(function (err) {
    if (!err) {
      res.redirect("/" + subject);
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      name: post.name,
      email: post.email,
      fee: post.fee,
      difficulty: post.difficulty,
      subject: post.subject,
      content: post.content,
    });
  });
});

app.get("/review", function (req, res) {
  res.render("reviews");
});

app.post("/review", function (req, res) {
  console.log(req.body.con);
  const post = new Review({
    name: req.body.name,
    image: req.body.image,
    con: req.body.con,
  });
  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});








// Comment Section 
app.get("/comment", function (req,res) {
  res.render("comment");
})
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
