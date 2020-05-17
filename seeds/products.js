
exports.seed = function (knex) {
  return knex('categories').select().then(category => {
    return knex('products').insert([
      { 
        name: 'Acer Monitor x200',
        category_id: category.find(cat => cat.name === 'Monitors').id,
        price: '350',
        description: 'This is nice',
        stock: 10
       }
    ]);
  })
};
