
exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", function (table) {
    table.increments();
    table.string("first_name", 255).notNullable().defaultTo('');
    table.string("last_name", 255).notNullable().defaultTo('');
    table.string("email", 255).notNullable().unique();
    table.specificType("hashed_password","char(60)").notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users");
}
