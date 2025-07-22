const express = require('express');
const router = express.Router();
const controller = require('../controllers/editEventController');

// Route to render the events details page
router.get(['/', '/editEvent'], controller.getEditEventPage);

// router.post('/editEvent', controller.editEvent);

module.exports = router;