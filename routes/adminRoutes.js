const router = require('express').Router();
const { authMiddleware, redirectLoggedInUser, adminMiddleware } = require('../middleware/MiddlewareManager');

const Address = require('../models/Address');
const Category = require('../models/Category');
const Order = require('../models/OrderDetails');
const OrderDetails = require('../models/Order');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Roles = require('../models/Roles');

module.exports = router;