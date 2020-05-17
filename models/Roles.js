const { Model } = require('objection');


class User extends Model {
    static tableName = 'roles';
}

module.exports = User;