const router = require('express').Router();
const { adminMiddleware } = require('../middleware/MiddlewareManager');
const OrderDetails = require('../models/OrderDetails');
const Category = require('../models/Category');

router.get('/salesbycategory', adminMiddleware, async (req, res) => {
    let orderDetails = await OrderDetails.query().select().withGraphFetched('product_stats');
    let categories = await Category.query().select();
    let prevId = 0;
    let categoryData = [];
    let price = 0;
    let totalPrice = 0;

    for (let i = 0; i < orderDetails.length; i++) {
        categoryData.push({ price: Number(orderDetails[i].product_stats[0].price), category_id: orderDetails[i].product_stats[0].category_id })
    }
    categoryData.sort((a, b) => {
        if (a.category_id < b.category_id) {
            return -1;
        }
        if (a.category_id > b.category_id) {
            return 1;
        }
        return 0;
    });

    for (let i = 0; i < categoryData.length; i++) {
        if (categoryData[i].category_id === prevId) {
            let previousCategory = categoryData[i - 1];

            previousCategory['price'] += categoryData[i].price;
            delete categoryData[i];
        } else {
            prevId = categoryData[i].category_id;
        }
    }

    let statsData = [];
    categoryData.forEach(categoryData => {
        if (categoryData !== undefined) {
            let categoryName = categories.filter(category => category.id === categoryData.category_id)[0];
            statsData.push({
                category: categoryName,
                price: categoryData.price
            });
            totalPrice += Number(categoryData.price);
        }
    });
    return res.send({ stats: statsData, totalPrice });
});

module.exports = router;