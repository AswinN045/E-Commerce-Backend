const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const config = require('../config/config')

cloudinary.config({
    cloud_name: config.cloud.cloudName,
    api_key: config.cloud.cloudKey,
    api_secret: config.cloud.cloudSecret,
});

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only JPEG, PNG, and GIF images are allowed'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

module.exports = { upload, cloudinary };