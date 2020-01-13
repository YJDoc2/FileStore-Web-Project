const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const mongoCfg = require('./config/mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

const app = express();
const EXPRESS_PORT = process.env.PORT || 5000;

//* Sessions and Passport Initialisations
app.use(
    session({
        secret: 'MYS',
        resave: true,
        saveUninitialized: false,
        ephemeral: true
    })
);

mongoose.connect(mongoCfg.db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
let db = mongoose.connection;

db.on('error', err => {
    console.error('Error in Connecting to Databse...');
    console.error(err);
    console.log('DB Connecrtion Error... Exiting');
    process.exit(1);
});

db.once('open', () => {
    console.log('Connected to Databse...');
});

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//* Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('*', function(req, res, next) {
    res.locals.user = req.user || null;
    next();
});

//* Routes
app.use('/api/user', require('./routes/user'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/files', require('./routes/file'));
app.use('/api/download', require('./routes/download'));
app.use('/api/collection', require('./routes/collection'));
// Handles any requests that don't match the ones above
app.use(express.static(path.join(__dirname, '/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});
//* ETC
app.listen(EXPRESS_PORT, () => {
    console.log(`Express listening on Port ${EXPRESS_PORT}...`);
});

// if (process.env.NODE_ENV === 'test') {
//     module.exports = app;
// }
