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

        res.setHeader('Content-Type', file.contentType);
        res.setHeader('Content-Length', file.length);
        res.setHeader('Content-Disposition', 'attachment');

        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
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
