const express = require('express');
const router = express.Router();
const eventAttendanceController = require('../controllers/eventAttendanceController');

// Route to render the events attendance page
router.get(['/', '/eventAttendance'], eventAttendanceController.getEventAttendancePage);

module.exports = router;