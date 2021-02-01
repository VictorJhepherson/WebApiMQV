const express = require('express');
const router = express.Router();

const LoginController = require('../controllers/LoginController');

router.post('/', LoginController.login);
router.post('/refresh', login, LoginController.refresh);

module.exports = router;