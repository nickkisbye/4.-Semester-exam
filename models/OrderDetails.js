const { Model } = require('objection');

const Order = require('./Order');
const Category = require('./Category');
const Product = require('./Product.js');

class OrderDetails extends Model {
    static tableName = 'product_order_junc';

    static relationMappings = {
        order: {
          relation: Model.HasManyRelation,
          modelClass: Order,
          join: {
            from: 'product_order_junc.order_id',
            to: 'orders.id'
          }
        },
        products: {
            relation: Model.HasManyRelation,
            modelClass: Product,
            join: {
              from: 'product_order_junc.product_id',
              to: 'products.id'
            }
          },
        product_stats: {
          relation: Model.HasManyRelation,
            modelClass: Product,
            filter: query => query.select('category_id', 'price'),
            join: {
              from: 'product_order_junc.product_id',
              to: 'products.id'
            },
          }
    };
}

module.exports = OrderDetails;