
exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', function(table) {
    table.increments();
    table.string('text');
    table.integer('user_id').references('users.id');
    table.integer('resource_id').references('resources.id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('comments');
};
