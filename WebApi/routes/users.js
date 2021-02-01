const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');
const bcrypt = require('bcrypt');
const login = require('../middleware/login');

const UserController = require('../controllers/UserController');

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname);
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

router.get('/AllUsers', login, UserController.getUsers);
router.get('/', login, UserController.getUsersByName);
router.post('/', upload.single('USR_PHOTO'), UserController.insertUsers);
router.patch('/', upload.single('USR_PHOTO'), login, UserController.updateUsers);
router.delete('/', login, UserController.deleteUsers);

module.exports = router;