const express = require('express');
const router = express.Router();
const controller = require('../controllers/memberCreateController');

// Route to render the events details page
router.get('/member', controller.renderPage);

router.post('/createMember', controller.createMember);

module.exports = router;