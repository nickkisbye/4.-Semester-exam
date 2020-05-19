const router = require('express').Router();
const { authMiddleware, adminMiddleware } = require('../middleware/MiddlewareManager');

const Address = require('../models/Address');
const Category = require('../models/Category');
const OrderDetails = require('../models/OrderDetails');
const Order = require('../models/Order');
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

router.get('/roles', async (_, res) => {
    const roles = await Roles.query().select();
    return res.send({ roles });
});

router.get('/users', adminMiddleware, async (_, res) => {
    const users = await User.query().select(selectManager.getSecureParameters()).withGraphFetched('roles').withGraphFetched('address');
    return res.send({ users });
});

router.get('/user/:id', adminMiddleware, async (req, res) => {
    const user = await User.query().findById(req.params.id).withGraphFetched('roles').withGraphFetched('address');
    return res.send({ user });
});

router.get('/settings', authMiddleware, async (req, res) => {
    const settings = await User.query().select(selectManager.getSecureParameters()).where('id', req.session.user.id).withGraphFetched('address').limit(1);
    return res.send({ settings: settings[0] });
});

router.get('/categories', async (_, res) => {
    const categories = await Category.query().select();
    return res.send({ categories });
});

router.get('/category/:id', async (req, res) => {
    const category = await Category.query().findById(req.params.id);
    return res.send({ category });
});

router.get('/products', async (_, res) => {
    const products = await Product.query().select().withGraphFetched('category');
    return res.send({ products });
});

router.get('/featured', async (_, res) => {
    const products = await Product.query().select().where('is_featured', 1).withGraphFetched('category');
    return res.send({ products });
});

router.get('/product/:id', async (req, res) => {
    const product = await Product.query().findById(req.params.id);
    return res.send({ product });
});

router.get('/orders', authMiddleware, async (req, res) => {
    let orders = null;
    if(req.session.user.role === 'USER') {
        orders = await Order.query().select().where('customer_id', req.session.user.id).withGraphFetched('users');
    } else {
        orders = await Order.query().select().withGraphFetched('users');
    }
    return res.send({ orders });
});

router.get('/order/:id', authMiddleware, async (req, res) => {
    const orderDetails = await OrderDetails.query().select().where('order_id', req.params.id).withGraphFetched('products');
    let totalOrderPrice = 0;

    let order = orderDetails.map(item => {
        totalOrderPrice += Number(item.products[0].price) * item.quantity;
        return {
            product: item.products[0],
            quantity: item.quantity,
            price: item.products[0].price
        }
    })

    return res.send({ order, totalOrderPrice });
});

router.get('/stats', async (_, res) => {

    const productCount = await Product.query().count();
    const categoryCount = await Category.query().count();
    const customerCount = await User.query().count();
    const orderCount = await Order.query().count();

    const stats = {
        products: productCount[0]["count(*)"],
        categories: categoryCount[0]["count(*)"],
        customers: customerCount[0]["count(*)"],
        orders: orderCount[0]["count(*)"]
    }

    res.send({ stats });
});

router.get('/transactions', async (_, res) => {
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