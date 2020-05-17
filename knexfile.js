const { connection } = require("./configs/mysqlConfig.js");

module.exports = {
  development: {
    client: 'mysql',
    connection
  }
};
