const express = require('express');
const app = express.Router();
const func = require('../lib/user-helper');
const resourceHelper = require('../lib/resource-helper');
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
    res.render('login');
  })

  .post(middleware.errorCheck, middleware.userAuthentication, (req, res) => {
    const user = { email: req.body.email }

    func.loginUser(user, (foundUser) => {
      req.session.email = foundUser.email;
      res.render('index', {user: foundUser});
    });
    
  });

// logout current user
app.route('/logout')
  .post((req, res) => {
    req.session = null;
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
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      avatar: req.body.avatar
    }
    func.generateUser(newUser, () => {
      req.session.email = newUser.email;
      res.render('index', {user: newUser});
    })
  });

//  New Resource Page

app.route('/create_resource')
  .get((req, res) => {
    res.render('create_resource');
  })

  .post((req, res) => {
    // function to create new resource
    const newResource = {
      title: req.body.title,
      url: req.body.url,
      topic: req.body.topic,
      description: req.body.description,
      
    }
    const user = req.session.email;
    resourceHelper.createNewResource(newResource, user, () => {
      res.render('index');
    });
    
  });

// View all resources

app.route('/resources')
  .get((req, res) => {
    resourceHelper.showResources((allResources) => {
      res.render('index', allResources);
    })
  });

// View specific resource

app.route('/resources/:id')
  .get((req, res) => {

    // function to check if resource exists
    // and return that resource
    
    const resourceId = req.params.id;
    resourceHelper.getResource(resourceId, (resource) => {
      res.render('resource-show', resource);
    })
  });

// Comment/Like/Rate specific resource

app.route('/resources/:id/comment')
  .post((req, res) => {

    //function to create comment on resource
    const comment = req.body.comment;
    resourceHelper.newComment(comment, () => {
      res.redirect('/resources/:id');
    })
  });

app.route('/resources/:id/rate')
  .post((req, res) => {

    // function to add rating
    const rate = req.body.rate;
    resourceHelper.newRate(rate, () => {
      res.redirect('/resources/:id');
    })
  });

app.route('/resources/:id/like')
  .post((req, res) => {
    
    // function to check if there is a like and like if there is none, remove like if there is one
    const like = req.body.like;
    resourceHelper.newLike(like, () => {
      res.redirect('/resources/:id')
    })
  });

// User profile page

app.route('/users/:id')
  .get((req, res) => {
    
    // function to get user profile page
    const user = req.params.id;
    func.getUser(user, (user) => {
      res.render('profile', user);
    })
  });

// User update/edit page

app.route('/users/:id/update')
  .get((req, res) => {
    const user = req.params.id;
    res.render('update_profile', user);
  })
  .post((req, res) => {
    const updatedUserInfo = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      avatar: req.body.avatar
    }
    func.updateUser(updatedUserInfo, () => {
      req.session.email = newUser.email;
      res.render('index', {user: updatedUserInfo});
    })
  })

app.route('/users/:id/resources')
  .get((req, res) => {
    const user = req.params.id;
    // function to get users created/liked resources

  })

app.route('/*').get((req, res) => {
    res.send('404 Page not found');
  });

module.exports = app;

