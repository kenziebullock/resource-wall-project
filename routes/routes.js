const express = require('express');
const app = express.Router();
const userHelper = require('../lib/user-helper');
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
    userHelper.loginCheck(req, res);
    res.render('login');
  })

  .post(middleware.errorCheck, middleware.userAuthentication, (req, res) => {
    const user = {
      email: req.body.email,
    }

    userHelper.loginUser(user, (foundUser) => {
      req.session.email = foundUser.email;
      req.session.user_id = foundUser.id;
      res.redirect('/resources');
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
      res.redirect('/resources');
    })
  });

//  New Resource Page

app.route('/resources/new')
  .get((req, res) => {
    res.render('create_resource');
  })

  .post(middleware.isLogin, (req, res) => {
    console.log(req.body);
    // function to create new resource
    const newResource = {
      title: req.body.title,
      url: req.body.url,
      topic: req.body.topic,
      description: req.body.description,

    }
    const user = req.session.email;
    resourceHelper.createNewResource(newResource, user, (err, newResource) => {
      req.flash("success", ` You Have Posted A New Resource. Thanks For Sharing `);
      res.redirect('/resources');
    });

  });

// View all resources

app.route('/resources')
  .get((req, res) => {
    resourceHelper.showResources((allResources) => {
      res.render('resources', { allResources });
    })
  });

// View specific resource

app.route('/resources/:id')
  .get((req, res) => {

    // function to check if resource exists
    // and return that resource

    const resourceId = req.params.id;
    resourceHelper.getResource(resourceId, (resource, comments) => {
      res.render('main', { resource: resource, comments: comments });
    })
  });

// Comment/Like/Rate specific resource

app.route(middleware.isLogin, '/resources/:id/comment')
  .post((req, res) => {

    //function to create comment on resource
    const comment = req.body.comment;
    const resourceId = req.params.id;
    const userId = req.session.user_id;
    resourceHelper.newComment(userId, resourceId, comment, (thisComment, thisUser) => {
      req.flash("success", ` You Have Added A Comment `);
      // this will replace with ajax instane call
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
  .post(middleware.isLogin, (req, res) => {
    
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
    const currentUser = {
      id: req.session.user_id,
      user_id: req.params.id
    }

    userHelper.getUser(currentUser, (user) => {
      res.render('profile', {user: user});
    })
  });

// User update/edit page

app.route('/users/:id/update')
  .get((req, res) => {
    const currentUser = {
      id: req.session.user_id,
      user_id: req.params.id
    }
    userHelper.getUser(currentUser, (user) => {
      res.render('update_profile', {user: user});
    })
  })
  .post((req, res) => {
    const updatedUserInfo = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      avatar: req.body.avatar,
      id: req.session.user_id
    }

    userHelper.updateUser(updatedUserInfo, () => {
      // req.session.email = newUser.email;
      res.render('profile', {user: updatedUserInfo});
    })
  })

app.route('/users/:id/resources')
  .get(middleware.isLogin, (req, res) => {
    const user = req.params.id;
    // function to get users created/liked resources
    resourceHelper.showMyResources(user, (myResources) => {
      res.render('resources', { allResources: myResources });
    });
  })

app.route('/*').get((req, res) => {
    res.send('404 Page not found');
  });

module.exports = app;
