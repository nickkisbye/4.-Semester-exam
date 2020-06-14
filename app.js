const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const session = require('express-session');
const rateLimit = require('express-rate-limit');
const secret = require('./configs/mysqlConfig').production.sessionSecret;
const fileupload = require('express-fileupload');

const dotenv = require("dotenv");
dotenv.config();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: secret, resave: true, saveUninitialized: false }));
app.use('/login', limiter);
app.use('/signup', limiter);
app.use(fileupload());

// ROUTES
const pageRoute = require('./routes/pageRoutes');
const authRoute = require('./routes/authRoutes');
const apiRoute = require('./routes/apiRoutes');
const paymentRoute = require('./routes/paymentRoutes');
const chartRoute = require('./routes/chartRoutes');

app.use(pageRoute);
app.use(authRoute);
app.use("/api", apiRoute);
app.use("/payment", paymentRoute);
app.use("/chart", chartRoute);

/**
 * Objection and knex setup
 */

const { Model } = require('objection');
const Knex = require('knex');
const knexConfig = require('./knexfile');

const knex = Knex(knexConfig.production);
Model.knex(knex);

io.on('connection', (socket) => {
    const { address } = socket.request.connection._peername;
    socket.on('pagechange', ({ username, pathname }) => {
        let socketObject = {};
        if (username === undefined) {
            socketObject = { user: address, pathname };
        } else {
            socketObject = { user: username, pathname };
        }
        io.emit('pagechanged', socketObject);
    });
    socket.on('disconnect', () => {

    });
});

server.listen(3000, (err) => {
    if (err) console.log(err);
    console.log("Listening on port", 3000);
})

