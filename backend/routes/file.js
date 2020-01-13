User = require('../models/User');
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

router.get('/:filename', isPersonalFile, (req, res) => {
    gfs.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).send({
                err: 'No file exists'
            });
        }

        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
    });
});

router.delete('/:filename', isPersonalFile, async (req, res) => {
    let isColl = req.params.filename.split('-')[0] === 'coll';
    if (isColl) {
        return res
            .status(404)
            .send({
                sucess: false,
                err: 'cannot delete individual file of a collection'
            });
    }

    gfs.findOne({ filename: req.params.filename }, function(err, file) {
        if (!file) {
            return res.status(404).send({ success: false });
        }
        gfs.remove(
            { filename: req.params.filename, root: 'uploads' },
            async (err, gridStore) => {
                if (err) {
                    return res.status(404).json({ err: err });
                }

                let user = await User.findOneAndUpdate(
                    { username: req.user.username },
                    {
                        $pull: {
                            files: { dbfilename: req.params.filename }
                        },
                        $inc: { usedSpace: -file.length }
                    },
                    {
                        new: true
                    }
                );
                res.status(200).send({ success: true, user: user });
            }
        );
    });
});

function isPersonalFile(req, res, next) {
    let filename = req.params.filename;
    if (filename.substring(0, 2) === 'ps') {
        ensureAuthenticated(req, res, () => {});
        if (
            req.user.files.some(file => {
                return file.dbfilename === filename;
            })
        ) {
            //The file belongs to the user
        } else {
            res.status(401).send({
                success: false,
                err: 'Authentication Error. Please Sign In.'
            });
        }
    }
    return next();
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).send({
            success: false,
            err: 'Authentication Error. Please Sign In.'
        });
    }
}

module.exports = router;
