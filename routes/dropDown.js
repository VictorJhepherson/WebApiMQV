const express = require('express');
const router = express.Router();

const DropDownController = require('../controllers/DropDownController');

router.get('/combo-churchs', DropDownController.getChurchs);
router.get('/combo-typehouse', DropDownController.getTypeHouse);
router.get('/combo-states', DropDownController.getStates);

module.exports = router;