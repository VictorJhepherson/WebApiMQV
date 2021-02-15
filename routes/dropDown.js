const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const DropDownController = require('../controllers/DropDownController');

router.post('/combo-churchs', login, DropDownController.getChurchs);
router.post('/combo-typehouse', login, DropDownController.getTypeHouse);
router.post('/combo-states', login, DropDownController.getStates);

module.exports = router;