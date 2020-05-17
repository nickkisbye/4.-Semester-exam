const { Model } = require('objection');

const Address = require('./Address.js');
const Roles = require('./Roles.js');

class User extends Model {
    static tableName = 'users';

    static relationMappings = {
        address: {
          relation: Model.BelongsToOneRelation,
          modelClass: Address,
          join: {
            from: 'users.address_id',
            to: 'addresses.id'
          }
        },
        roles: {
          relation: Model.BelongsToOneRelation,
          modelClass: Roles,
          join: {
            from: 'users.role_id',
            to: 'roles.id'
          }
        }
    };
}

module.exports = User;