const express = require('express');
const router = express.Router();
const eventAttendanceController = require('../controllers/eventAttendanceController');

// GET: /eventAttendance?id=...
router.get('/eventAttendance', eventAttendanceController.getEventAttendancePage);

// POST: Save attendance
router.post('/eventAttendance/finalize', eventAttendanceController.finalizeAttendance);

// (Optional) Add this if you plan to support updating one record at a time
// router.post('/eventAttendance/update', eventAttendanceController.updateSingle);

module.exports = router;
