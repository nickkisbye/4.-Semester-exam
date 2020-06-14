const { development, production } = require("./configs/mysqlConfig.js");

module.exports = {
  development: {
    client: 'mysql',
    connection: development
  },
  production: {
    client: 'mysql',
    connection: production
  }
};
