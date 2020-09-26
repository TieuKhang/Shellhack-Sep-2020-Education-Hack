// package to code node js in an easier way
const express = require("express");

// package that works with database
const mongoose = require("mongoose");

// package that allows parsing info sent from the post request
const bodyParser = require("body-parser");

// set up authentication
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

// initialize app
const app = express();

// initialize parsing info sent from the post request
app.use(bodyParser.urlencoded({ extended: true }));

// connect to public folder to use CSS
app.use(express.static("public"));

// connect to ejs
app.set('view engine', 'ejs');

//initialize session

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// application on home route, we'll render the list page
app.route("/")
    .get(function(req,res){
        res.render("list");        
    });

app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port 3000");
});
