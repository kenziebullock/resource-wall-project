const ENV         = process.env.ENV || "development";
const knexConfig  = require("../../knexfile");
const knex        = require("knex")(knexConfig[ENV]);


module.exports = {

  errorCheck: function(req, res) {
    if (!req.body.email) {
        // some error message
        return res.send('No email address entered.');
    } else if (!req.body.password) {
        // some error message
        return res.send('No password entered.');
    } else {
        return;
    }
  },

  userAuthentication: function(req, res) {

    if (req.body.email === 'alice@gmail.com' && req.body.password === 'alice') {
      req.session.email = req.body.email;
      return res.redirect('/');
    } else {
      return res.send('Invalid login credentials.');
    }
  },

  loginCheck: function(req, res) {
    if (req.session.email) {
      return res.redirect('/index');
    }
  },

  // templateVars: {
  //   email: req.session.email,
  //   username: req.session.username
  // },
 
  // functions to make

  // check if user is in database



  // check password against users pass

  // generate new user
  generateUser: function(req, res) {
    // function to add user to database
  }
  


}