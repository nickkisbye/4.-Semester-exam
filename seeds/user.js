exports.seed = function (knex) {
  return knex('roles').select().then(roles => {
    return knex('users').insert([
      {
        username: 'nickkisbye',
        email: 'nkh94@msn.com',
        password: 'testaccount123',
        first_name: 'Nick',
        last_name: 'Hansen',
        age: 25,
        phone_number: '20946211',
        address_id: 1,
        role_id: roles.find(role => role.role === 'ADMIN').id,
      },
    ]);
  });
};



