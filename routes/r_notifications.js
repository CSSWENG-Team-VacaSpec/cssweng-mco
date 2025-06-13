const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Route to display notification page
router.get('/notifications', notificationController.getNotificationPage);

module.exports = router;