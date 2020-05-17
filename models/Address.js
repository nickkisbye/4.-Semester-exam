const { Model } = require('objection');

class Address extends Model {
    static tableName = 'addresses';
}

module.exports = Address;