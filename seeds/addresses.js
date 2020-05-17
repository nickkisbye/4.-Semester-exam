
exports.seed = function(knex) {
  return knex('addresses').insert([{
    postal_code: '4600',
    city: 'Køge',
    address: 'Søsvinget 369'
  }])
};
