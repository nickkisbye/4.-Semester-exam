
exports.seed = function(knex) {
      return knex('product_order_junc').insert([
        {
          order_id: 1,
          product_id: 1, 
          quantity: 3
        }
      ]);
};
