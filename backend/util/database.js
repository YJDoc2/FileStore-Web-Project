const mongoose = require('mongoose');
const mongoCfg = require('../config/mongodb');

if (!mongoose.connection || mongoose.connection.readyState === 0) {
    //* Mongoose Initializations
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
}
