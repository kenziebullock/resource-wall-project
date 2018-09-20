const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);


module.exports = {

  // check if there is a logined user
  loginCheck: function(req, res) {
    if (req.session.email) {
      return res.redirect('/index');
    }
  },
  
  // handle login and serach user info from db
  loginUser: (user, callback) => {
    knex.select('name').from('users')
    .where({email: user.email})
    .limit(1)
    .then((rows) => {
      callback(rows[0]);
    }).catch(() => {
      console.log('Error! Check middleware or database connection');
    })
  },

  // insert a new user
  generateUser: function(newUser, callback) {
    knex('users').insert(newUser)
    .then(() => {
      callback();
    })
  }
    
    
    
  }