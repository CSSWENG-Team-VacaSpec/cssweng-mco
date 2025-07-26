const express = require('express');
const router = express.Router();
const controller = require('../controllers/profileEditController.js');

router.get('/profile', controller.renderPage);
router.post('/edit-profile-details', controller.editProfileDescription);

module.exports = router;