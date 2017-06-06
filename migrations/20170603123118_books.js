
exports.up = function(knex, Promise) {
  return knex.schema.createTable("books", function (table) {
    table.increments();
    table.string("title", 255).notNullable().defaultTo('');
    table.string("author", 255).notNullable().defaultTo('');
    table.string("genre", 255).notNullable().defaultTo('');
    table.text("description").notNullable().defaultTo('');
    table.text("cover_url").notNullable().defaultTo('');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("books");
}
