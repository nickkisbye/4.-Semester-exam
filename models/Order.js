const { Model } = require('objection');

const User = require('./User');

class Order extends Model {
    static tableName = 'orders';

    static relationMappings = {
        users: {
          relation: Model.BelongsToOneRelation,
          modelClass: User,
          join: {
            from: 'orders.customer_id',
            to: 'users.id'
          }
        }
    };
}

module.exports = Order;