const express = require('express');
const router = express.Router();
const delete_cancelEvent = require('../controllers/delete_cancelEvent');

router.post('/cancelEvent', delete_cancelEvent.cancelEvent);

router.post('/deleteEvent', delete_cancelEvent.deleteEvent);

module.exports = router;
