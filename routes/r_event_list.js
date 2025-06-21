const express = require('express');
const router = express.Router();
const eventListController = require('../controllers/eventListController');

// Route to render the events list page
<<<<<<< HEAD
router.get('/eventlist', eventListController.getEventListPage);
=======
router.get(['/', '/event-list'], eventListController.getEventListPage);
>>>>>>> 2de24c8ba3c6a5aa9f724ca81debef2dbedfa72f

module.exports = router;