const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);

// passing the entire registration info including em

const middleware = {
  // this middleware function will check if the registeration is valid
  // call next when registeration is valid, redirect to login if invalid
  registerValidator: (req, res, next) => {
    // set email
    const email = req.body.email.toLowerCase();
    knex.select('*').from('users').where({email})
    .then((rows) => {
      if (rows.length === 0){
        return next();
      } else {
        req.flash("error", "Duplicated Email. Please login");
        res.redirect('/');
      }
    })
  },

  errorCheck: (req, res, next) => {
    if (!req.body.email) {
        // some error message
        req.flash("error", "Email Cannot Be Empty");
        res.redirect('back');
    } else if (!req.body.password) {
        // some error message
        req.flash("error", "Password Cannot Be Empty");
        res.redirect('back');
    } else {
        return next();
    }
  },

  userAuthentication: (req, res, next) => {
    // console.log(email, password);

    const email = req.body.email;
    const password = req.body.password;

    knex.select('*').from('users').where({ email }).andWhere({ password })
    .then((rows) => {
      if (rows.length === 1){
        req.flash("success", `Hello ${rows[0].name}, Welcome back! `);
        return next();
      } else {
        req.flash("error", "Invalid Password or Email");
        res.redirect('/')
      }
    })
  },

  isLogin: (req, res, next) => {
    if (req.session.email){
      return next();
    } else{
      req.flash("error", "Sorry, You need to login first");
      res.redirect('/');
    }
  },

  postingValidator: (req, res, next) => {
    if (!req.body.comment && !req.body.url && !req.body.title && !req.body.topic) {
      req.flash('error', 'You did not post anything');
      res.redirect('back');
    } else {
      return next();
    }
  }
}


module.exports = middleware;
