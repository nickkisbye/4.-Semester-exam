exports.seed = function(knex) {
  return knex('transactions').insert([
    { 
      order_id: 1,
      status: 'Completed'
     }
  ]);
};
