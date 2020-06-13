const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const OrderDetails = require('../models/OrderDetails');
const Order = require('../models/Order');
const stripeKey = process.env.STRIPE_KEY

router.get('/stripekey', async (req, res) => {
    res.send({stripeKey, email: req.session.user.email});
});


router.post('/purchase', async (req, res) => {
    const { storedProducts, totalPrice, stripeTokenId } = req.body;
    stripe.charges.create({
        amount: totalPrice * 100,
        source: stripeTokenId,
        currency: 'dkk'
    }).then(async () => {
        const newOrder = await Order.query().insert({ 
            customer_id: req.session.user.id,
            state: 'Finished'
        })

        let prevProduct;
        let count;
        let productData = [];

        for(let i = 0; i<storedProducts.length; i++) {
            if(storedProducts[i].name !== prevProduct) {
                prevProduct = storedProducts[i].name;
                count = 1;
                productData.push({ [storedProducts[i].id]: count })
            } else {
                count++;
                let key = Object.keys(productData[productData.length - 1])[0]
                productData[productData.length - 1][key] = count;
            }
        }
        
        Promise.all(productData.forEach(async (product) => {
            let key = Object.keys(product)[0];
            await OrderDetails.query().insert({
                order_id: newOrder.id,
                product_id: key,
                quantity: product[key]
            })
        }));

        res.send({ message: 'success' });
    })
})

module.exports = router;