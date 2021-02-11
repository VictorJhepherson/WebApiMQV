const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');
const bcrypt = require('bcrypt');
const login = require('../middleware/login');

const WarningController = require('../controllers/WarningController');

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './warningphotos/');
    },
    filename: function(req, file, cb){
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        let url = 'https://projectmqv-webapi.herokuapp.com/uploads/';
        cb(null, url + data + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', login, WarningController.getWarnings);
router.post('/', login, upload.single('WARNING_PHOTOS'), WarningController.insertWarnings);
router.post('/warningId', login, WarningController.getWarning);
router.post('/warningphotos', login, upload.single('WARNING_PHOTOS'), WarningController.insertWarningPhoto);
router.patch('/', login, WarningController.updateWarnings);
router.delete('/', login, WarningController.deleteWarnings);

module.exports = router;