const express = require('express');
const router = express.Router();
const eventDetailsController = require('../controllers/eventDetailsController');

// Route to render the events details page
router.get(['/', '/eventDetails'], eventDetailsController.getEventDetailsPage);

module.exports = router;