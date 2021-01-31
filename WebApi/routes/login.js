const express = require('express');
const router = express.Router();

const LoginController = require('../controllers/LoginController');

router.post('/', LoginController.login);
router.post('/refresh', LoginController.refresh);

module.exports = router;