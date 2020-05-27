const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const { authMiddleware, redirectLoggedInUser, adminMiddleware } = require('../middleware/MiddlewareManager');
const { generateLayout } = require('../services/LayoutService')

const Address = require('../models/Address');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const ImageService = require('../services/ImageService');

/**
 * PUBLIC
 */

router.get('/', (req, res) => {
    const frontpage = fs.readFileSync(path.join(__dirname, '../views/', 'frontpage.html'), "utf8");
    return res.send(generateLayout(frontpage, req.session.user));
});

router.get('/products/', (req, res) => {
    const products = fs.readFileSync(path.join(__dirname, '../views/', 'products.html'), "utf8");
    return res.send(generateLayout(products, req.session.user));
});

router.get('/card/', authMiddleware, (req, res) => {
    const card = fs.readFileSync(path.join(__dirname, '../views/user/', 'card.html'), "utf8");
    return res.send(generateLayout(card, req.session.user));
});

router.get('/product/:id', (req, res) => {
    const product = fs.readFileSync(path.join(__dirname, '../views/', 'product.html'), "utf8");
    return res.send(generateLayout(product, req.session.user));
});

router.get('/login', redirectLoggedInUser, (req, res) => {
    const login = fs.readFileSync(path.join(__dirname, '../views/', 'login.html'), "utf8");
    return res.send(generateLayout(login, req.session.user));
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.query().select().where('username', username).withGraphFetched('roles');

    if(user.length === 0) return res.redirect('/');

    bcrypt.compare(password, user[0].password, (err, result) => {
        if(result == true) {
            req.session.user = {
                id: user[0].id,
                username: user[0].username,
                role: user[0].roles.role
            }
            if (req.session.user.role === 'ADMIN') return res.redirect('/admin/products');
            if (req.session.user.role === 'USER') return res.redirect('/orders');
        } else {
            return res.redirect('/login');
        }
    })
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    return res.redirect('/');
});

router.get('/reset', redirectLoggedInUser, (req, res) => {
    // To be implemented
    const reset = fs.readFileSync(path.join(__dirname, '../views/', 'reset.html'), "utf8");
    return res.send(generateLayout(reset, req.session.user));
});

router.get('/signup', redirectLoggedInUser, (req, res) => {
    const signup = fs.readFileSync(path.join(__dirname, '../views/', 'signup.html'), "utf8");
    return res.send(generateLayout(signup, req.session.user));
});

router.post('/signup', async (req, res) => {
    const { username, email, password, password_repeat, first_name, last_name, age, phone_number, address, city, postal_code } = req.body;

    if (password !== password_repeat) return res.redirect('/signup');

    const fetchAddress = await Address.query().select('id').where('postal_code', postal_code).andWhere('city', city).andWhere('address', address);
    const addressAlreadyExists = fetchAddress.length > 0;
    let newAddress = null;

    if (addressAlreadyExists) {
        newAddress = { id: fetchAddress[0].id };
    } else {
        newAddress = await Address.query().insert({ postal_code, city, address });
    }

    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, async (err, hash) => {
        const newUser = await User.query().insert({
            username,
            email,
            password: hash,
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
    })
});

/**
 * USER
 */

router.get('/orders', authMiddleware, (req, res) => {
    const orders = fs.readFileSync(path.join(__dirname, '../views/', 'user/orders.html'), "utf8");
    return res.send(generateLayout(orders, req.session.user));
});

router.get('/order/:id', authMiddleware, (req, res) => {
    const orders = fs.readFileSync(path.join(__dirname, '../views/', 'user/order.html'), "utf8");
    return res.send(generateLayout(orders, req.session.user));
});

router.get('/settings', authMiddleware, (req, res) => {
    const settings = fs.readFileSync(path.join(__dirname, '../views/', 'user/settings.html'), "utf8");
    return res.send(generateLayout(settings, req.session.user));
});

router.post('/update', authMiddleware, async (req, res) => {
    const { username, email, first_name, last_name, age, phone_number, address_id, address, city, postal_code } = req.body;

    await User.query().patch({
        username,
        email,
        first_name,
        last_name,
        age,
        phone_number
    }).where('id', req.session.user.id);

    await Address.query().patch({ address, city, postal_code }).where('id', address_id);

    return res.redirect('/settings');
});

/**
 * ADMIN
 */

router.get('/admin/categories', adminMiddleware, (req, res) => {
    const categories = fs.readFileSync(path.join(__dirname, '../views/', 'admin/categories.html'), "utf8");
    return res.send(generateLayout(categories, req.session.user));
});

router.post('/categories', adminMiddleware, (req, res) => {
    return res.redirect('/categories');
});

router.post('/category', async (req, res) => {
    const { category_name } = req.body;
    const image = req.files.file

    const imageService = new ImageService();
    const imageUrl = await imageService.uploadImage(image);
    await Category.query().insert({ name: category_name, img_url: imageUrl });

    return res.redirect('admin/categories/');
});

router.get('/admin/products', adminMiddleware, (req, res) => {
    const products = fs.readFileSync(path.join(__dirname, '../views/', 'admin/products.html'), "utf8");
    return res.send(generateLayout(products, req.session.user));
});

router.get('/admin/product', adminMiddleware, (req, res) => {
    const products = fs.readFileSync(path.join(__dirname, '../views/', 'admin/product.html'), "utf8");
    return res.send(generateLayout(products, req.session.user));
});

router.get('/admin/product/:id', adminMiddleware, async (req, res) => {
    const product = fs.readFileSync(path.join(__dirname, '../views/', 'admin/editproduct.html'), "utf8");
    return res.send(generateLayout(product, req.session.user));
});

router.post('/admin/product/', adminMiddleware, async (req, res) => {
    const { name, category_id, price, description, stock, product_id } = req.body;
    console.log(req.body);

    await Product.query().patch({ name, category_id, price, description, stock}).where('id', product_id);
    return res.redirect('/admin/products');
});



router.post('/product', adminMiddleware, async (req, res) => {
    const { name, category_id, price, description, stock } = req.body;
    const image = req.files.file;

    const imageService = new ImageService();
    const imageUrl = await imageService.uploadImage(image);

    await Product.query().insert({ name, category_id, price, description, stock, image_url: imageUrl });

    return res.redirect('/admin/products');
});

router.get('/admin/users', adminMiddleware, (req, res) => {
    const users = fs.readFileSync(path.join(__dirname, '../views/', 'admin/users.html'), "utf8");
    return res.send(generateLayout(users, req.session.user));
});

router.post('/users', adminMiddleware, (req, res) => {
    return res.redirect('/users');
});

module.exports = router;