const connstr =
    process.env.MONGO_ATLAS_URI || 'mongodb://localhost:27017/FileStore';
module.exports = {
    db: connstr,
    secret: 'MYS'
};
