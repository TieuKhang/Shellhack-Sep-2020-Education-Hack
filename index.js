//environment requirement
require('dotenv').config();

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
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//connect to database by mongoose
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);


// initialize List Schema
const assignList = new mongoose.Schema({
    name: String
});

// initialize Model
const ToDoList = mongoose.model("ToDoList", assignList);

// 1st default data
const intro = new ToDoList({
    name:'Welcome to your list'
});

// 2nd default data
const outro = new ToDoList({
    name: 'Delete any message by clicking on the left of it'
});

// array consist of default data
const defaultList = [intro, outro];

//create User schema for the database
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

//create user Model
const User = new mongoose.model("User", userSchema);

//Initialize passport, a method for authentication
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// application on home route, we'll render the list page
app.route("/")
    .get(function(req,res){
        res.render("homepage");        
    });

// application on route login
app.route("/login")
    .get(function(req,res){
        res.render("login");
    })
    .post(function (req, res) {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        })
    
        req.login(user, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/list");
                })
            }
        })
    });

// application on route login
app.route("/register")
    .get(function(req,res){
        res.render("register");
    })
    .post(function (req, res) {
        User.register({ username: req.body.username }, req.body.password, function (err, user) {
            if (err) {
                console.log(err);
                res.redirect("/register");
            }
            else {
                passport.authenticate("local")(req,res, function () {
                res.redirect("/list");
                })
            }
        })
    });

app.route("/list")
    .get(function (req, res) {
        // read data of database
        if (req.isAuthenticated()){
            ToDoList.find({}, function (err, defaultToDoList) {
                // check length of array to know if adding default data is necessary
                if (defaultToDoList.length == 0) {
                    ToDoList.insertMany(defaultList, function (err) {
                        if (!err) {
                            console.log("Successfully add data!"); 
                        }
                    })
                    res.redirect("/list");
                }
                else {
                    // render ejs file
                    res.render("list", {listName:"up-to-date" , listItem: defaultToDoList });
                }
            });
        }
        else{
            res.redirect("/login");
        }
    })
    .post(function (req, res) {
        // data from post request
        const addItem = req.body.addingItem; // new item being added
        const trackList = req.body.trackCurrentList; // name of the current list
        // create new data
        const newItem = new ToDoList({
            name: addItem
        });
        newItem.save();
        res.redirect("/list");
    })

app.post("/delete", function (req, res) {
    // checkbox ID
    const deleteItem = req.body.checkbox;
    // current custom List
    const customDelete = req.body.customCheckbox;
        // delete item from custom lsit
        ToDoList.findByIdAndRemove(deleteItem, function (err) {
            if (!err) {
                console.log("succesfully delete item!");
                res.redirect("/list");
            }
        });
});


app.listen(process.env.PORT || 2000, function () {
    console.log("Listening on port 2000");
});
