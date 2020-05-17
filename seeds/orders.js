
exports.seed = function(knex) {
      return knex('orders').insert([
        { customer_id: 1 }
      ]);
};
