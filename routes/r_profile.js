const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.get('/profile/:id', profileController.renderPage);

module.exports = router;