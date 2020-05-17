const { Model } = require('objection');

const Order = require('./Order');

class Transaction extends Model {
    static tableName = 'transactions';

    static relationMappings = {
        order: {
          relation: Model.BelongsToOneRelation,
          modelClass: Order,
          join: {
            from: 'transactions.order_id',
            to: 'orders.id'
          }
        }
    };
}

module.exports = Transaction;