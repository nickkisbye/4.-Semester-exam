const router = require('express').Router();
const { adminMiddleware } = require('../middleware/MiddlewareManager');
const OrderDetails = require('../models/OrderDetails');

router.get('/salesbycategory', adminMiddleware, async (req, res) => {
    let orderDetails = 
    await OrderDetails.query().select('categories.id', 'categories.name', 'products.price', 'quantity')
    .join('products', 'product_order_junc.product_id', 'products.id')
    .join('categories', 'products.category_id', 'categories.id').orderBy('categories.id', 'ASC');

    let statsData = [];
    let prevCategory;
    let price;
    let totalPrice = 0;

    for(let i = 0; i < orderDetails.length; i++) {
        totalPrice += Number(orderDetails[i].price) * orderDetails[i].quantity;
        if(orderDetails[i].name !== prevCategory) {
            prevCategory = orderDetails[i].name;
            price = Number(orderDetails[i].price) * orderDetails[i].quantity;
            statsData.push({
                category: {
                    name: orderDetails[i].name,
                    price
                }
            })
        } else {
            price += Number(orderDetails[i].price) * orderDetails[i].quantity;
            statsData[statsData.length - 1]['category'].price = price;
        }
    }
    return res.send({ stats: statsData, totalPrice });
});

module.exports = router;