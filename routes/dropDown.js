const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const DropDownController = require('../controllers/DropDownController');

router.post('/combo-churchs', DropDownController.getChurchs);
router.post('/combo-typehouse', DropDownController.getTypeHouse);
router.post('/combo-states', DropDownController.getStates);
router.post('/combo-usertype', login, DropDownController.getUserType);

module.exports = router;