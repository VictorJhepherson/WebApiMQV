const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');

const ScheduleController = require('../controllers/ScheduleController');

router.get('/AllSchedules', login, ScheduleController.getSchedules);
router.get('/', login, ScheduleController.getSchedulesByTitle);
router.post('/', login, ScheduleController.insertSchedules);
router.patch('/', login, ScheduleController.updateSchedules);
router.delete('/', login, ScheduleController.deleteSchedules);

module.exports = router;