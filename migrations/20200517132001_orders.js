
exports.up = function (knex) {
    return knex.schema
        .createTable('orders', table => {
            table.increments('id').notNullable();
            table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
            table.integer('customer_id').unsigned().notNullable();
            table.foreign('customer_id').references('users.id');
            table.string('state');

        })
        .createTable('product_order_junc', table => {
            table.increments('id').notNullable();

            table.integer('order_id').unsigned().notNullable();
            table.foreign('order_id').references('orders.id');

            table.integer('product_id').unsigned().notNullable();
            table.foreign('product_id').references('products.id');

            table.integer('quantity');
        })
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('orders')
        .dropTableIfExists('product_order_junc')
        .dropTableIfExists('transactions')
};
