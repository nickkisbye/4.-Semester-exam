const router = require('express').Router();
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const { generateLayout } = require('../services/LayoutService');
const { authMiddleware, redirectLoggedInUser, adminMiddleware } = require('../middleware/MiddlewareManager');

const Address = require('../models/Address');
const User = require('../models/User');

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
                role: user[0].roles.role,
                email: user[0].email
            }
            if (req.session.user.role === 'ADMIN') return res.redirect('/dashboard');
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

module.exports = router;