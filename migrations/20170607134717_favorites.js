
exports.up = function(knex, Promise) {
  return knex.schema.createTable("favorites", function (table) {
    table.increments();
    table.integer('book_id').index().references('books.id').notNullable().onDelete('cascade');
    table.integer('user_id').index().references('users.id').notNullable().onDelete('cascade');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("favorites");
}
