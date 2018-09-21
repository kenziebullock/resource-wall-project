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
        console.log('valid registeration');
        return next();
      } else {
        console.log('invalid registeration. User exist');
        res.redirect('/login');
      }
    })
  },

  errorCheck: (req, res, next) => {
    if (!req.body.email) {
        // some error message
        return res.send('No email address entered.');
    } else if (!req.body.password) {
        // some error message
        return res.send('No password entered.');
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
        return next();
      } else {
        res.send('Invalid login credentials');
        // res.redirect('/login')
      }
    })
  },

  isLogin: (req, res, next) => {
    if (req.session.email){
      return next();
    } else{
      res.redirect('/login');
    }
  }

}


module.exports = middleware;
