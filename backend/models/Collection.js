const mongoose = require('mongoose');

const CollectionSchema = mongoose.Schema(
    {
        name: {
            type: String,
            requred: [true, 'Please give a collection name'],
            unique: [true, 'This collection name is Already taken...'],
            trim: true,
            maxlength: [
                15,
                'Collection name should be less than or equal to 15 characters long'
            ]
        },
        creater: {
            type: String
        },
        files: [
            {
                ext: { type: String },
                originalname: { type: String },
                dbfilename: { type: String },
                date: { type: Date, default: Date.now() },
                mimetype: { type: String },
                size: { type: Number }
            }
        ]
    },
    { collection: 'Collections' }
);

module.exports = mongoose.model('Collection', CollectionSchema);
