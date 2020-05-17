const { Model } = require('objection');

class Category extends Model {
    static tableName = 'categories';
}

module.exports = Category;