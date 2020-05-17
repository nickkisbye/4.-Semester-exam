exports.seed = function (knex) {
  return knex('categories').insert([
    { name: 'Computers' },
    { name: 'Mice' },
    { name: 'Keyboards' },
    { name: 'Monitors' },
    { name: 'Laptops' },
    { name: 'Mousepads' },
    { name: 'Utility' },
    { name: 'Accessories' },
  ])
};
