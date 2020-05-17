
exports.up = function(knex) {
    return knex.schema
    .createTable('categories', table => {
        table.increments('id').notNullable();
        table.string('name').unique().notNullable;
    })
    .createTable('products', table => {
        table.increments('id').notNullable();
        table.string('name');
        table.string('image_url');

        table.integer('category_id').unsigned().notNullable();
        table.foreign('category_id').references('categories.id');
        
        table.string('price');
        table.string('description');
        table.integer('stock');
    })
};

exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('categories')
    .dropTableIfExists('products')
};
