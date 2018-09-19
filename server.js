"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const cookieSession = require('cookie-session');


// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  secret: 'something'
}));

app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

const router = express.Router();

router.use(function(req, res, next) {

  // log each request to the console
  console.log(req.method, req.url);

  // continue doing what we were doing and go to the route
  next(); 
});


// Login Page

app.route('/login')
   
  .get(function(req, res) {
    // const templateVars = {
    //   email: req.session.email,
    //   username: req.session.username
    // }
    if (req.session.authenticated) {
      res.redirect('/');
    }
    res.render('login', templateVars);
   }) 

   .post(function(req, res) {
    if (req.body.email === 'alice@gmail.com' && req.body.password === 'alice') {
      req.session.authenticated = true;
      req.session.email = req.body.email;
      res.redirect('/');
    } else {
      res.redirect('/login');
    }

   });

app.route('/logout')
   .get(function(req, res) {
     delete req.session.authenticated;
     res.redirect('/login');
   })

// Registration Page

app.route('/register')
   .get(function(req, res) {
    res.send('register get route');
   })
   .post(function(req, res) {
    res.send('register post route');
   });



//  New Resource Page

app.route('/resources/new')
   .get(function(req, res) {
    res.send('resources/new get route');
   })
   .post(function(req, res) {
    res.send('resources/new post route');
   });

// View all resources

app.route('/resources')
   .get(function(req, res) {
     res.send('resources get route');
   })

// View specific resource

app.route('/resources/:id')
   .get(function(req, res) {
    res.send('resources/:id get route');
   })

// Comment/Like/Rate specific resource

app.route('/resources/:id/comment')
   .post(function(req, res) {
    res.send('resources/:id/comment post route');
   })

app.route('/resources/:id/rate')
   .post(function(req, res) {
    res.send('resources/:id/rate post route');
   })

app.route('/resources/:id/like')
   .post(function(req, res) {
    res.send('resources/:id/like post route');
   })

// User profile page

app.route('/users/:id')
   .get(function(req, res) {
    res.send('users/:id get route');
   })

// User update/edit page

app.route('/users/:id/update')
   .get(function(req, res) {
    res.send('users/:id/update get route');
   })
   .post(function(req, res) {
     res.send('users/:id/update post route');
   })

app.route('/users/:id/resources')
   .get(function(req, res) {
     res.send('/users/:id/resources');
   })



app.use('/', router);

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});


const checkAuth = function()