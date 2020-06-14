const router = require('express').Router();
const fs = require('fs');
const path = require('path');

const { authMiddleware, redirectLoggedInUser, adminMiddleware } = require('../middleware/MiddlewareManager');
const { generateLayout } = require('../services/LayoutService');

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

router.get('/dashboard', adminMiddleware, (req, res) => {
    const dashboardPage = fs.readFileSync(path.join(__dirname, '../views/', 'admin/dashboard.html'), "utf8");
    return res.send(generateLayout(dashboardPage, req.session.user));
});

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