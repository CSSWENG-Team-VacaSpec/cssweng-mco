const express = require('express');
const router = express.Router();
const controller = require('../controllers/profileEditController.js');

router.get('/profile', controller.renderPage);
router.post('/edit-profile-details', controller.editProfileDescription);
router.post('/changePassword', controller.changePassword);


module.exports = router;