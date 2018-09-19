
exports.up = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, name: 'Alice', email: 'alice@gmail.com', password: 'alice', avatar: 'https://api.adorable.io/avatars/232/alice@gmail.com.png'}),
        knex('users').insert({id: 2, name: 'Bob', email: 'bob@gmail.com', password: 'bob', avatar: 'https://api.adorable.io/avatars/232/bob@gmail.com.png'}),
        knex('users').insert({id: 3, name: 'Charlie', email: 'Charlie@gmail.com', password: 'charlie', avatar: 'https://api.adorable.io/avatars/232/charlie@gmail.com.png'})
      ]);
    });
};

exports.down = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, name: 'Alice'}),
        knex('users').insert({id: 2, name: 'Bob'}),
        knex('users').insert({id: 3, name: 'Charlie'})
      ]);
    });
};
