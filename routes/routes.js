const express = require('express');
const app = express.Router();


// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// app.use(function(req, res, next) {
  
//   // log each request to the console
//   console.log(req.method, req.url);

//   // continue doing what we were doing and go to the route
//   next(); 
// });


// Login Page

app.route('/login')
    
  .get(function(req, res) {
  // const templateVars = {
  //   email: req.session.email,
  //   username: req.session.username
  // }
  // if (req.session.authenticated) {
  //   res.redirect('/');
  // }
  res.render('index');
  }) 

  .post(function(req, res) {
  // const users = db.users;
  if (req.body.email === 'alice@gmail.com' && req.body.password === 'alice') {
    req.session.email = req.body.email;
    res.redirect('/');
  } else {
    res.redirect('/login');
  }

  });

app.route('/logout')
  .get(function(req, res) {
    delete req.session;
    res.redirect('/login');
  });

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

module.exports = app;