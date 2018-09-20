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
      callback('/index', {user: rows[0]});
    })
  },

  generateUser: function(req, res) {
    
  }
    
    
    
  }