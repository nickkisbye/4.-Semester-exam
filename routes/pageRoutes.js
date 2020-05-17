const router = require('express').Router();
const { authMiddleware, redirectLoggedInUser, adminMiddleware } = require('../middleware/AuthManager');

const Address = require('../models/Address');
const User = require('../models/User');

/**
 * PUBLIC
 */

router.get('/products', (req, res) => {
    return res.sendFile(`${__dirname}/views/products.html`);
});

router.get('/categories', (req, res) => {
    return res.sendFile(`${__dirname}/views/categories.html`);
});

router.get('/about', (req, res) => {
    return res.sendFile(`${__dirname}/views/about.html`);
});

router.get('/contact', (req, res) => {
    return res.sendFile(`${__dirname}/views/contact.html`);
});

router.get('/login', redirectLoggedInUser, (req, res) => {
    return res.sendFile(`${__dirname}/views/login.html`);
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.query().select().where('username', username).andWhere('password', password).withGraphFetched('roles');
    if (user) {
        req.session.user = {
            id: user[0].id,
            username: user[0].username,
            role: user[0].role.role
        }
        if (req.session.user.role === 'ADMIN') return res.sendFile(`${__dirname}/admin/products.html`);
        if (req.session.user.role === 'USER') return res.sendFile(`${__dirname}/user/settings.html`);
    }
    return res.sendFile(`${__dirname}/user/index.html`);
});


router.get('/reset', redirectLoggedInUser, (req, res) => {
    return res.sendFile(`${__dirname}/views/reset.html`);
});

router.get('/signup', redirectLoggedInUser, (req, res) => {
    return res.sendFile(`${__dirname}/views/signup.html`);
});

router.post('/signup', async (req, res) => {
    const { username, email, password, first_name, last_name, age, phone_number, address, city, postal_code } = req.body;

    const newAddress = await Address.query().insert({ postal_code, city, address });
    const newUser = await User.query().insert({
        username,
        email,
        password,
        first_name,
        last_name,
        age,
        phone_number,
        address_id: newAddress.id,
        role_id: 2
    })
    if (newUser) {
        res.redirect('/login');
    } else {
        res.redirect('/signup');
    }
});

/**
 * USER
 */

router.get('/orders', authMiddleware, (req, res) => {
    return res.sendFile(`${__dirname}/user/orders.html`);
});

router.get('/settings', authMiddleware, (req, res) => {
    return res.sendFile(`${__dirname}/user/settings.html`);
});

/**
 * ADMIN
 */

router.get('/categories', adminMiddleware, (req, res) => {
    return res.sendFile(`${__dirname}/admin/categories.html`);
});

router.get('/orders', adminMiddleware, (req, res) => {
    return res.sendFile(`${__dirname}/admin/orders.html`);
});

router.get('/products', adminMiddleware, (req, res) => {
    return res.sendFile(`${__dirname}/admin/products.html`);
});

router.get('/users', adminMiddleware, (req, res) => {
    return res.sendFile(`${__dirname}/admin/users.html`);
});

module.exports = router;