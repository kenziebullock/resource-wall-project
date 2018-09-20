
exports.up = function(knex, Promise) {
  return Promise.all([
    knex('resources').insert({
      id: 1, 
      title:'react-for-beginner',
      description: 'This is the most fundenmental docs for reactjs',
      url: 'https://reactjs.org/',
      topic: 'web development',
      user_id: 1
    }),
    knex('comments').insert({
      id: 1,
      text: 'This is useful',
      user_id: 1,
      resource_id: 1
    }),
    knex('likes').insert({
      id: 1,
      user_id: 1,
      resource_id: 1
    }),
    knex('rates').insert({
      id: 1,
      score: 8,
      resource_id: 1,
      user_id: 1
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex('resources').del(),
    knex('comments').del(),
    knex('likes').del(),
    knex('rates').del()
  ])
};
