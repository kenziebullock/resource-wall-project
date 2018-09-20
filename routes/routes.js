const express = require('express');
const app = express.Router();
const func = require('../lib/user-helper');
const middleware = require('../middleware');

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/index", (req, res) => {
    res.render("index");
});

// Login Page
app.route('/login')
  .get((req, res) => {
    func.loginCheck(req, res);
    res.render('login', func.templateVars);
  }) 

  .post(middleware.errorCheck, middleware.userAuthentication, (req, res) => {
    const users = {
      email: req.body.email,
    }
    func.loginUser(users, res.redirect);
    
  });

// logout current user
app.route('/logout')
  .post((req, res) => {
    // req.session.email = null;
    delete req.session;
    res.redirect('/login');
  });

// Registration Page
app.route('/register')
  .get((req, res) => {
    func.loginCheck(req, res);
    res.render('register');
  })
  .post(middleware.errorCheck, middleware.registerValidator, (req, res) => {
    // registration
    res.send('register post route');
  });

//  New Resource Page

app.route('/resources/new')
  .get((req, res) => {
    res.render('new-resource');
  })

  .post((req, res) => {
    // function to create new resource
    const newResource = {
      title: req.body.title,
      url: req.body.url,
      topic: req.body.topic,
      description: req.body.description
    }
    func.createNewResource(newResource, () => {
      res.render('index');
    });
    
  });

// View all resources

app.route('/resources')
  .get((req, res) => {
    getResources(() => {
      res.render('index')
    })
  });

// View specific resource

app.route('/resources/:id')
  .get((req, res) => {
    // function to check if resource exists
    
    // pass resource to templateVars
    const templateVars = {
      resource: database[req.params.id]
    }

    // render resource
    res.render('resources/:id', templateVars);
  })

// Comment/Like/Rate specific resource

app.route('/resources/:id/comment')
  .post((req, res) => {
    //function to create comment on resource

    const templateVars = {
      resource: database[req.params.id]
    }

    res.send('resources/:id/comment post route', templateVars);
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

app.route('/*').get((req, res) => {
    res.send('404 Page not found');
  });

module.exports = app;

