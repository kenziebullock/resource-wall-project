const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);

let allResources = [];

const resourcesHelper = {
  // this function will show all resources
  showResources: (callback) => {
    const field = ['resources.id', 'title', 'url', 'description']
    knex.select(field).from('resources')
    .leftJoin('rates', function () {
      this.on('rates.resource_id', '=', 'resources.id')
    })
    .avg('rates.score')
    .groupBy(field)
    .then((resources) => {
      allResources = resources;
      allResources.forEach((resource) => {
        resource.likes = 0;
      })
      // console.log(allResources);
    })
    .then(() => {
      knex.select('resources.id').from('resources')
      .join('likes', function() {
        this.on('likes.resource_id', '=', 'resources.id')
      })
      .groupBy('resources.id')
      .count()
      .then((rows) => {
        allResources.forEach((resource) => {
          rows.forEach((row) => {
            if(resource.id === row.id){
              resource.likes = row.count;
            }
          })
        });
      })
      .then(() => {
        callback(allResources);
      })
    })
  },

  // this function will create a new resources
  createNewResource: (newResource, user, callback) => {
    knex.select('id').from('users').where('email', '=', user)
    .then((rows) => {
      const userId = rows[0].id;
      return userId;
    })
    .then((userId) => {
      newResource.user_id = userId;
      knex('resources').insert(newResource)
      .then(() => {
        callback(null, newResource);
      })
    })
  },

  getResource : (resourceId, callback) => {
    knex.select('*').from('resources').where('id', '=', resourceId)
    .then((rows) => {
      callback(rows[0]);
    })
  },

  showMyResources : (userId, callback) => {
    const field = ['resources.id', 'title', 'url', 'description']
    knex.select(field).from('resources')
    .join('users', function() {
      this.on('users.id', '=', 'resources.user_id')
    })
    .leftJoin('rates', function () {
      this.on('rates.resource_id', '=', 'resources.id')
    })
    .where('users.id', '=', userId)
    .avg('rates.score')
    .groupBy(field)
    .then((resources) => {
      allResources = resources;
      allResources.forEach((resource) => {
        resource.likes = 0;
      })
      // console.log(allResources);
    })
    .then(() => {
      knex.select('resources.id').from('resources')
      .join('likes', function() {
        this.on('likes.resource_id', '=', 'resources.id')
      })
      .groupBy('resources.id')
      .count()
      .then((rows) => {
        allResources.forEach((resource) => {
          rows.forEach((row) => {
            if(resource.id === row.id){
              resource.likes = row.count;
            }
          })
        });
      })
      .then(() => {
        callback(allResources);
      })
    })
  },
  
}

module.exports = resourcesHelper;

const user = 'home@home.com';

// resourcesHelper.showMyResources(1);



