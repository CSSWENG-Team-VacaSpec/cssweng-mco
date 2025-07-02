const express = require('express');
const router = express.Router();
const controller = require('../controllers/eventCreateController');

// Route to render the events details page
router.get('/event', controller.renderPage);

module.exports = router;