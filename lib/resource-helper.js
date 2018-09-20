const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);

let allResources = [];

const resourcesHelper = {
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
}

module.exports = resourcesHelper;

// resourcesHelper.showResources();

// .then((resources) => {
//   resources.forEach((resource, index) => {
//     knex.select('*').from('likes').where('likes.resource_id', '=', resource.id)
//     .then((rows) => {
//       resources[index].likes = rows.length;
//       console.log(resource);
//     })
//   })

// })


// SELECT resources.id, title, url, description FROM resources 
// LEFT JOIN likes ON resources.id = likes.resource_id
// LEFT JOIN rates ON resources.id = rates.resource_id
// GROUP BY resources.id
