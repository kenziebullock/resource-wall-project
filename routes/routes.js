const express = require('express');
const app = express.Router();
<<<<<<< HEAD
const userHelper = require('../lib/user-helper');
const resourceHelper = require('../lib/resource-helper');
=======
const func = require('../lib/user-helper');
>>>>>>> 9654cc2fa3b9d3f1e99498cc88aed77c85cca78e
const middleware = require('../middleware');

// Home page
app.get("/", (req, res) => {
  res.render("index");
});



// Login Page
app.route('/login')
  .get((req, res) => {

    userHelper.loginCheck(req, res);
    res.render('login');

  })

  .post(middleware.errorCheck, middleware.userAuthentication, (req, res) => {
    const users = {
      email: req.body.email,
    }
    func.loginUser(users, res.redirect);

    userHelper.loginUser(user, (foundUser) => {
      req.session.email = foundUser.email;
      res.render('index', {user: foundUser});
    });

  });

// logout current user
app.route('/logout')
  .get((req, res) => {
    req.session.email = null;
    delete req.session;
    res.redirect('/login');
  });

// Registration Page

app.route('/register')
  .get((req, res) => {
    userHelper.loginCheck(req, res);
    res.render('register');
  })
  .post(middleware.errorCheck, middleware.registerValidator, (req, res) => {
    // registration

    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      avatar: req.body.avatar
    }
    userHelper.generateUser(newUser, () => {
      req.session.email = newUser.email;
      res.render('index', {user: newUser});
    })

  });

//  New Resource Page

app.route('/resources/new')
  .get((req, res) => {
    res.send('resources/new get route');
  })
  .post((req, res) => {
    res.send('resources/new post route');
  });

// View all resources

app.route('/resources')
  .get((req, res) => {

    resourceHelper.showResources((allResources) => {
      res.render('resources',  { allResources } );
    })
  });


// View specific resource

app.route('/resources/:id')
  .get((req, res) => {
    res.send('resources/:id get route');
  })

// Comment/Like/Rate specific resource

app.route('/resources/:id/comment')
  .post((req, res) => {
    res.send('resources/:id/comment post route');
  })

app.route('/resources/:id/rate')
  .post((req, res) => {
    res.send('resources/:id/rate post route');
  })

app.route('/resources/:id/like')
  .post((req, res) => {
    res.send('resources/:id/like post route');
  })

// User profile page

app.route('/users/:id')
  .get((req, res) => {
    res.send('users/:id get route');
  })

// User update/edit page

app.route('/users/:id/update')
  .get((req, res) => {
    res.send('users/:id/update get route');
  })
  .post((req, res) => {
    res.send('users/:id/update post route');
  })

app.route('/users/:id/resources')
  .get((req, res) => {
    res.send('/users/:id/resources');
  })

module.exports = app;

