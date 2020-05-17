const { Model } = require('objection');

const Category = require('./Category.js');

class Product extends Model {
    static tableName = 'products';

    static relationMappings = {
        category: {
          relation: Model.BelongsToOneRelation,
          modelClass: Category,
          join: {
            from: 'products.category_id',
            to: 'categories.id'
          }
        }
    };
}

module.exports = Product;