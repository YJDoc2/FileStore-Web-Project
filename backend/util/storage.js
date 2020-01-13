const path = require('path');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');

User = require('../models/User');
const mongoCfg = require('../config/mongodb');
const checkValidFileType = require('./file_validation');

//* Multer and Storage settings

const storage = new GridFsStorage({
    url: mongoCfg.db,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename =
                    req.file_group +
                    '-' +
                    buf.toString('hex') +
                    path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({
    storage: storage,
    //* 20MB = 2*10^7Bytes
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        //!!! How to stop exceeding allowed storage,in sml=all additions
        checkValidFileType(file, cb);
    }
}).array('files', 15);

module.exports = upload;
