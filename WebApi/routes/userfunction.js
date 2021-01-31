const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');

const UserFunctionController = require('../controllers/UserFunctionController');

router.get('/AllFunctions', login, UserFunctionController.getFunction);
router.get('/', login, UserFunctionController.getFunctionByDesc);
router.post('/', login, UserFunctionController.insertUserFunction);
router.patch('/', login, UserFunctionController.updateUserFuntion);
router.delete('/', login, UserFunctionController.deleteUserFunction);

module.exports = router;