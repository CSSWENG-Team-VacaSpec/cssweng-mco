const express = require('express');
const router = express.Router();
const eventListController = require('../controllers/eventListController');

// Route to render the events list page
router.get(['/', '/event-list'], eventListController.getEventListPage);

module.exports = router;