const User = require('../models/User');
const Collection = require('../models/Collection');
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Grid = require('gridfs-stream');
eval(
    `Grid.prototype.findOne = ${Grid.prototype.findOne
        .toString()
        .replace('nextObject', 'next')}`
);

const conn = mongoose.createConnection('mongodb://localhost:27017/FileStore', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

router.get('/:name', async (req, res) => {
    try {
        let collection = await Collection.findOne({
            name: req.params.name
        });
        // Check if file

        if (!collection) {
            return res.status(404).send({
                success: false,
                err: 'No such Collection exists'
            });
        }

        res.status(200).send({ success: true, collection: collection });
    } catch (err) {
        res.status(500).send({ success: false, err: err });
    }
});

router.delete('/:name', ensureAuthenticatedAndOwner, async (req, res) => {
    try {
        let collection = await Collection.findOne({
            name: req.params.name
        });
        // Check if file

        if (!collection) {
            return res.status(404).send({
                success: false,
                err: 'No such Collection exists'
            });
        }
        let tmp;
        collection.files.forEach(async file => {
            tmp = await gfs.remove({
                filename: file.dbfilename,
                root: 'uploads'
            });
        });

        tmp = await Collection.deleteOne({ name: req.params.name });
        let user = await User.findOneAndUpdate(
            { username: req.user.username },
            {
                $pull: {
                    collections: {
                        name: req.params.name
                    }
                }
            },
            {
                new: true
            }
        );
        res.status(200).send({ success: true, user: user });
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, err: err });
    }
});

function ensureAuthenticatedAndOwner(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.collections.some(coll => coll.name === req.params.name)) {
            return next();
        } else {
            res.status(404).send({
                success: false,
                err:
                    'Cannot delete a collection which was not created by the user'
            });
        }
    } else {
        res.status(401).send({
            success: false,
            err: 'Authentication Error. Please Sign In.'
        });
    }
}

module.exports = router;
