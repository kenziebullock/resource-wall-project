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
        allResources.forEach((resource) => {
          resource.img = randomImage();
        })
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
        resources[0].img = randomImage();
        callback(resources[0], comments);
      })
    })
  },

  // this will return resources for user's own resources and resources that they liked
  showMyResources : (userId, callback) => {
    const field = ['resources.id', 'title', 'url', 'description', 'topic']
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
        allResources.forEach((resource) => {
          resource.img = randomImage();
        })
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
  },

  //post rate status

  newRate: (userId, resourceId, rating, callback) => {
    knex
     .select('*')
     .from('rates')
     .where('user_id',userId)
     .andWhere('resource_id',resourceId)
     .then((rows) => {
      console.log(rows);
      if(rows.length === 0){
        const newrating = {
          user_id:userId,
          resource_id:resourceId,
          score:rating
        }
        knex('rates')
        .insert(newrating)
        .then(() => {
          const err = null
          callback(err);
        })
      } else {
        const err = {
          message: 'You have already rated'
        }
        callback(err);

      }

     })
  },

  // taking a query as an array and call searchEach function on each word
  search: (query, callback) => {
    let results = [];
    query.forEach((word, index) => {
      searchEach(word, index)
    });

    // search for individual word
    function searchEach (word, index) {
      knex.select('*').from('resources')
      .whereRaw(`LOWER(topic) like LOWER('%${word}%')`)
      .orWhereRaw(`LOWER(title) like LOWER('%${word}%')`)
      .orWhereRaw(`LOWER(description) like LOWER('%${word}%')`)
      .orWhereRaw(`LOWER(url) like LOWER('%${word}%')`)
      .then((rows) => {   
        results.push(...rows);
        if (!query[index + 1]){
          results = results.filter((thing, index, self) =>
            index === self.findIndex((t) => (
              t.id === thing.id
            ))
          );
          results.forEach((resource) => {
            resource.img = randomImage();
          })
          callback(null, results)
        }
      })
    };
  },

}

function randomImage () {
  const imglib = [
    'https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=cf61f7387cf2cb8758d724978fcbd198&auto=format&fit=crop&w=1950&q=80',
    'https://images.unsplash.com/photo-1537529303831-73bb722023f4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=39fa3a3097578fafffb575d730953f81&auto=format&fit=crop&w=1950&q=80',
    'https://images.unsplash.com/photo-1537567921203-a842146983a1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9dcf5db70b83fd4eadaffc763788f076&auto=format&fit=crop&w=1950&q=80', 
    'https://images.unsplash.com/photo-1526540976851-f136023efba9?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b3ef2bc7183e8c32a614c187da4dcf10&auto=format&fit=crop&w=1910&q=80',
    'https://images.unsplash.com/photo-1523265987393-d988d7d777d1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=8bbc76448aa70f0cb47fe5b4a313bae0&auto=format&fit=crop&w=1950&q=80',
    'https://images.unsplash.com/photo-1528208079124-a2387f039c99?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=54cb024e8c199272158560d22264c185&auto=format&fit=crop&w=1950&q=80',
    'https://images.unsplash.com/photo-1526243741027-444d633d7365?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7491eb281478f3b97661bae38cbcb34b&auto=format&fit=crop&w=1951&q=80'
  ]

  return imglib[Math.floor(Math.random() * imglib.length)];
}

module.exports = resourcesHelper;

// resourcesHelper.showResources(null);




