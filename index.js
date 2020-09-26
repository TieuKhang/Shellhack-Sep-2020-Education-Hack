// package to code node js in an easier way
const express = require("express");

// package that works with database
const mongoose = require("mongoose");

// package that allows parsing info sent from the post request
const bodyParser = require("body-parser");

// initialize app
const app = express();

// initialize parsing info sent from the post request
app.use(bodyParser.urlencoded({ extended: true }));

// application on home route, we'll render the list page
app.route("/")
    .get(function(req,res){
        res.render("list");        
    });