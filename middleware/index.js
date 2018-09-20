const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);

// passing the entire registration info including em

var middleware = {
  // this middleware function will check if the registeration is valid
  // call next when registeration is valid, redirect to login if invalid
  registerValidator: (req, res, next) => {
    // set email
    const email = req.body.email.toLowerCase();
    knex.select('*').from('users').where({email})
    .then((rows) => {
      if (rows.length === 0){
        console.log('valid registeration');
        // return next();
      } else {
        console.log('invalid registeration. User exist');
        // res.redirect('/login');
      }
    }).finally(knex.destroy);
  }
}


const sample = {
  body: {
    email: 'Carlie@gmail.com'
  }
}

middleware.registerValidator(sample);

module.exports = middleware;