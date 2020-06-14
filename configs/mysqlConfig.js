module.exports = {
    development: {
        host: 'localhost',
        database: 'webshop',
        user: 'root',
        password: '',
        sessionSecret: 'aF054ffsdCæf_%#BdO0p',
    },
    production: {
        host: 'den1.mysql3.gear.host',
        database: 'techwebshop',
        user: 'techwebshop',
        password: process.env.GEARHOST_PASS,
        sessionSecret: 'aF054ffsdCæf_%#BdO0p',
    }
}