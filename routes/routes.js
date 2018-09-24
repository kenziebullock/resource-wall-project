const express = require('express');
const app = express.Router();
const userHelper = require('../lib/user-helper');
const resourceHelper = require('../lib/resource-helper');
const middleware = require('../middleware');
const moment = require('moment');
const path = require('path');

// Home page
app.get("/", (req, res) => {
  userHelper.countUser((err, count) => {
    if (err) throw err;
    res.render("index", { count });
  })
});

app.get("/index", (req, res) => {
    res.redirect("/");
});

// Login Page
app.route('/login')

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
    res.redirect('/');
  });

// Registration Page
app.route('/register')

  .post(middleware.errorCheck, middleware.registerValidator, (req, res) => {
    // registratino
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      avatar: req.body.avatar || 'https://cdn.iconscout.com/icon/free/png-256/avatar-369-456321.png'
    }
    userHelper.generateUser(newUser, (id) => {
      req.session.email = newUser.email;
      req.session.user_id = id;
      res.redirect('/resources');
    })
  });

//  New Resource Page

app.route('/resources/new')
  .get((req, res) => {
    res.render('create_resource');
  })

  .post(middleware.isLogin, middleware.postingValidator, (req, res) => {
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

// route for search
app.route('/resources/search')
  .get((req, res) => {
    // search
    let query = req.query.query;
    query = query.split(' ');
    resourceHelper.search(query, (err, results) => {
      if (err){
        req.flash('error', err.message);
      }
      res.render('resources', { allResources: results });
    })
  })

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
      comments.forEach((comment) => {
        comment.created_at = moment(comment.created_at).fromNow();
      });
      res.render('main', { resource: resource, comments: comments });
    })
  });

// Comment/Like/Rate specific resource

app.route('/resources/:id/comment')
  .post(middleware.isLogin, middleware.postingValidator, (req, res) => {

    //function to create comment on resource
    const comment = req.body.comment;
    const resourceId = req.params.id;
    const userId = req.session.user_id;

    resourceHelper.newComment(userId, resourceId, comment, (thisComment, thisUser) => {
      req.flash("success", ` You Have Added A Comment `);
      // this will replace with ajax instane call
      res.redirect('back');
    })
  });

app.route( '/resources/:id/rate')
  .post(middleware.isLogin, (req, res) => {
    console.log(req.body);
      resourceHelper.newRate(req.session.user_id, req.params.id, req.body.rate, (err) => {
        if (err) {
          req.flash('error', err.message);
        } else {
          req.flash('success', 'You have rated this resource');
        }
        res.redirect('back');
      })

  });

app.route('/resources/:id/like')
  .post((req, res) => {
    if (!req.session.user_id) {
      const message = 'Guest cannot Like';
      res.json({message});
    } else {
      resourceHelper.newLike(req.session.user_id, req.body.resource_id, (err, increment) => {
        res.json({increment})
      });
    }
  });

// User profile page

app.route('/users/:id')
  .get(middleware.isLogin, (req, res) => {

    // function to get user profile page
    const currentUser = {
      id: req.session.user_id,
      user_id: req.params.id
    }

    userHelper.getUser(currentUser, (user) => {
      resourceHelper.showMyResources(currentUser.id, (myResources) => {
        res.render('profile', { user, myResources });
      })
    })
  });

// User update/edit page

app.route('/users/:id/update')
  // .get((req, res) => {
  //   const currentUser = {
  //     id: req.session.user_id,
  //     user_id: req.params.id
  //   }
  //   userHelper.getUser(currentUser, (user) => {
  //     res.render('update_profile', {user: user});
  //   })
  // })
  .post((req, res) => {
    const updatedUserInfo = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      avatar: req.body.avatar,
      id: req.session.user_id
    }

    userHelper.updateUser(updatedUserInfo, () => {
      resourceHelper.showMyResources(updatedUserInfo.id, (myResources) => {
        res.render('profile', {user: updatedUserInfo, myResources: myResources});
      })
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
    res.sendFile('404.html', { root: path.join(__dirname, '../public') });
  });

module.exports = app;
