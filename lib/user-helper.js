const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);


module.exports = {

  
  loginCheck: function(req, res) {
    if (req.session.email) {
      return res.redirect('/index');
    }
  },
  
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

  generateUser: function(newUser, callback) {
    knex('users').insert(newUser)
    .then(() => {
      callback();
    })
  }
    
    
    
  }