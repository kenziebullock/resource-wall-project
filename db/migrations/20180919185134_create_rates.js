
exports.up = function(knex, Promise) {
  return knex.schema.createTable('rates', function(table) {
    table.increments();
    table.integer('score');
    table.integer('user_id').references('users.id');
    table.integer('resource_id').references('resources.id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('rates');
};
