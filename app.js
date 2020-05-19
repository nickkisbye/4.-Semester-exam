const express = require('express');
const app = express();
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const secret = require('./configs/mysqlConfig').connection.sessionSecret;
const { authMiddleware } = require('./middleware/MiddlewareManager');

app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: secret, resave: true, saveUninitialized: false }));
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }));

// ROUTES
const pageRoute = require('./routes/pageRoutes');
const apiRoute = require('./routes/apiRoutes');
const adminRoute = require('./routes/adminRoutes');

app.use(pageRoute);
app.use("/api", apiRoute);

/**
 * Objection and knex setup
 */

const { Model } = require('objection');
const Knex = require('knex');
const knexConfig = require('./knexfile');

const knex = Knex(knexConfig.development);
Model.knex(knex);

app.listen(3000, (err) => {
    if (err) console.log(err);
    console.log("Listening on port", 3000);
})

