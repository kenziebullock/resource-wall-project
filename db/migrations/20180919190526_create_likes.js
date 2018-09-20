
exports.up = function(knex, Promise) {
  return knex.schema.createTable('likes', function(table) {
    table.increments();
    table.integer('user_id').references('users.id');
    table.integer('resource_id').references('resources.id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('likes');
};
