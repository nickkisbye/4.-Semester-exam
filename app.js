const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const session = require('express-session');
const rateLimit = require('express-rate-limit');
const secret = require('./configs/mysqlConfig').connection.sessionSecret;
const fileupload = require('express-fileupload');

const dotenv = require("dotenv");
dotenv.config();

app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: secret, resave: true, saveUninitialized: false }));
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(fileupload());

// ROUTES
const pageRoute = require('./routes/pageRoutes');
const apiRoute = require('./routes/apiRoutes');

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

