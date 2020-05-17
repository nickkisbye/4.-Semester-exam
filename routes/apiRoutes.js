const router = require('express').Router();
const { authMiddleware, redirectLoggedInUser } = require('../middleware/AuthManager');

const Address = require('../models/Address');
const Category = require('../models/Category');
const Order = require('../models/OrderDetails');
const OrderDetails = require('../models/Order');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Roles = require('../models/Roles');
const SelectManager = require('../utils/SelectManager');
const selectManager = new SelectManager();

// API routes

/**
 * GET
 */

router.get('/roles', async (req, res) => {
    const roles = await Roles.query().select();
    return res.send({ roles });
});

router.get('/users', async (req, res) => {
    const users = await User.query().select(selectManager.getSecureParameters()).withGraphFetched('roles').withGraphFetched('address');
    return res.send({ users });
});

router.get('/user/:id', async (req, res) => {
    const user = await User.query().findById(req.params.id).withGraphFetched('roles').withGraphFetched('address');
    return res.send({ user });
});

router.get('/categories', async (req, res) => {
    const categories = await Category.query().select();
    return res.send({ categories });
});

router.get('/category/:id', async (req, res) => {
    const category = await Category.query().findById(req.params.id);
    return res.send({ category });
});

router.get('/products', async (req, res) => {
    const products = await Product.query().select();
    return res.send({ products });
});

router.get('/product/:id', async (req, res) => {
    const product = await Product.query().findById(req.params.id);
    return res.send({ product });
});

router.get('/orders', async (req, res) => {
    const orders = await Order.query().select().withGraphFetched('order').withGraphFetched('products');
    return res.send({ orders });
});

router.get('/order/:id', async (req, res) => {
    const order = await Order.query().findById(req.params.id).withGraphFetched('order').withGraphFetched('products');
    return res.send({ order });
});

router.get('/transactions', async (req, res) => {
    const transactions = await Transaction.query().select().withGraphFetched('order');
    return res.send({ transactions });
});

router.get('/transaction/:id', async (req, res) => {
    const transaction = await Transaction.query().findById(req.params.id).withGraphFetched('order');
    const orderDetails = await OrderDetails.query().findById(transaction.order_id).select('id');
    const order = await Order.query().select().where('order_id', orderDetails.id).withGraphFetched('products'); 
    return res.send({ transaction, order });
});


module.exports = router;