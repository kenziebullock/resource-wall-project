
exports.up = function(knex, Promise) {
  return knex.schema.createTable('resources', function (table) {
    table.increments();
    table.string('title');
    table.string('description');
    table.string('url');
    table.string('topic');
    table.integer('user_id').references('users.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
