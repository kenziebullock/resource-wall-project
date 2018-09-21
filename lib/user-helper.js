const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);


userHelper = {

  // check if there is a logined user
  loginCheck: function(req, res) {
    if (req.session.email) {
      return res.redirect('/index');
    }
  },
  
  // handle login and serach user info from db
  loginUser: (user, callback) => {
    knex.select('*').from('users')
    .where({email: user.email})
    .limit(1)
    .then((rows) => {
      callback(rows[0]);
    }).catch(() => {
      console.log('Error! Check middleware or database connection');
    })
  },

  getUser: function(user, callback) {
    if (user.id.toString() === user.user_id) {
      knex.select('*').from('users')
        .where({id: user.id})
        .limit(1)
        .then((rows) => {
          callback(rows[0]);
        }).catch(() => {
          console.log('ERRORZ! check user-helper getUser func');
        })
    } else {
      // need error logic to deal with not authorised user
      console.log('not authed');
    }
    
  },

  // insert a new user
  generateUser: function(newUser, callback) {
    knex('users').insert(newUser)
    .then(() => {
      callback();
    })
  },  
    
  updateUser: function(updatedUserInfo, callback) {
    // knex update on user
    knex('users')
    .where({id: })
    .update(updatedUserInfo)
  },
}

module.exports = userHelper;
