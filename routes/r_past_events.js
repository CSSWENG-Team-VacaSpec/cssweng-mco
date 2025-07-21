const express = require('express');
const router = express.Router();
const pastEventsController = require('../controllers/pastEventsController');

// Route to render the past events page
router.get(['/', '/pastEvents'], pastEventsController.getPastEventsPage);

module.exports = router;