const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);

let allResources = [];

const resourcesHelper = {
  // this function will show all resources
  showResources: (callback) => {
    const field = ['resources.id', 'title', 'url', 'description', 'topic']
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

  // this will return a specific resources
  getResource : (resourceId, callback) => {
    knex.select('*').from('resources').where('id', '=', resourceId)
    .then((resources) => {
      knex.select(['users.name', 'comments.text']).from('comments')
      .leftJoin('users', function() {
        this.on('users.id', '=', 'comments.user_id')
      })
      .leftJoin('resources', function() {
        this.on('comments.resource_id', '=', 'resources.id')
      })
      .where('resources.id', '=', resourceId)
      .then((comments) => {
        callback(resources[0], comments);
      })
    })
  },

  // this will return resources for user's own resources and resources that they liked
  showMyResources : (userId, callback) => {
    const field = ['resources.id', 'title', 'url', 'description']
    knex.select(field).from('resources')
    .join('users', function() {
      this.on('users.id', '=', 'resources.user_id')
    })
    .leftJoin('rates', function () {
      this.on('rates.resource_id', '=', 'resources.id')
    })
    .leftJoin('likes', function () {
      this.on('likes.resource_id', '=', 'resources.id')
    })
    .where('users.id', '=', userId)
    .orWhere('likes.user_id', '=', userId)
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
        // console.log(allResources);
        callback(allResources);
      })
    })
  },

  // post new comments to this resource
  newComment: (userId, resourceId, text, callback) => {
    const newComment = {
      text,
      user_id: userId,
      resource_id: resourceId
    };
    knex('comments').insert(newComment)
    .then(() => {
      knex.select('name').from('users')
      .where('id', '=', userId)
      .then((users) => {
        callback(newComment.text, users[0].name)
      })
    })
  },

  // post like status 
  newLike: (userId, resourceId , callback) => {
    knex
      .select('*')
      .from('likes')
      .where('user_id', userId)
      .andWhere('resource_id', resourceId)
      .then((rows) => {
        if(rows.length === 0) {
          const like = {
            user_id: userId, 
            resource_id: resourceId
          }
          knex('likes')
            .insert(like)
            .then(() => {
              callback(null, 1);
            })
        } else {
          const like = {
            user_id: userId, 
            resource_id: resourceId
          }
          knex
            .from('likes')
            .where('user_id', userId)
            .andWhere('resource_id', resourceId)
            .del()
            .then(() => {
              callback(null, -1);
            })
        }
      })
  }
  
}

module.exports = resourcesHelper;


// resourcesHelper.newLike(2, 1, null);


