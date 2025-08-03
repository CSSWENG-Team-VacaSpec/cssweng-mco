const express = require('express');
const router = express.Router();
const controller = require('../controllers/profilePictureController');

router.get('/api/avatar/:id', controller.getProfilePicture);

module.exports = router;