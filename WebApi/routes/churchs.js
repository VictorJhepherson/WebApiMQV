const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');

const ChurchController = require('../controllers/ChurchController');

router.get('/AllChurchs', login, ChurchController.getChurchs);
router.get('/', login, ChurchController.getChurchsByDesc);
router.post('/', login, ChurchController.insertChurchs);
router.patch('/', login, ChurchController.updateChurchs);
router.delete('/', login, ChurchController.deleteChurchs);

module.exports = router;