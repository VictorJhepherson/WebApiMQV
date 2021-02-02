const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const LoginController = require('../controllers/LoginController');

router.post('/', LoginController.login);
router.post('/logout', login, LoginController.logout);
router.post('/refresh', login, LoginController.refresh);

module.exports = router;