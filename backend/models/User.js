const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            requred: [true, 'Please give a username'],
            unique: [true, 'This Username is Already taken...'],
            trim: true,
            maxlength: [
                15,
                'Username should be less than or equal to 15 characters long'
            ]
        },
        password: {
            type: String,
            required: true
        },
        usedSpace: {
            type: Number,
            default: 0
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
        ],
        collections: [
            {
                name: { type: String },
                ext: { type: String },
                originalname: { type: String },
                dbfilename: { type: String },
                date: { type: Date, default: Date.now() },
                mimetype: { type: String },
                size: { type: Number }
            }
        ]
    },
    { collection: 'Users' }
);

module.exports = mongoose.model('Users', UserSchema);
