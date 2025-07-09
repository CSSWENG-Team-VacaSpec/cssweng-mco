const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const userPermitted = require('../middlewares/userPermitted');

// GET notifications page — auto-routes to manager or team member
router.get('/notifications', userPermitted(['Manager', 'Team Member']), notificationController.getNotificationPage);

// GET manager-specific notifications (can be used for AJAX, but also for server-side)
router.get('/notifications/manager', userPermitted(['Manager']), notificationController.getManagerNotifications);

// GET team member-specific notifications
router.get('/notifications/team-member', userPermitted(['Team Member']), notificationController.getTeamMemberNotifications);

router.post('/respondInvite/:id', notificationController.respondInvite);


module.exports = router;
