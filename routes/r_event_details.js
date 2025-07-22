const express = require('express');
const router = express.Router();
const eventDetailsController = require('../controllers/eventDetailsController');

// Route to render the events details page
router.get(['/', '/event-details'], eventDetailsController.getEventDetailsPage);

router.get('/searchEventParticipants', eventDetailsController.searchEventParticipants);

module.exports = router;