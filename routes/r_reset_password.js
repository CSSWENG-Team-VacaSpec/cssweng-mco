const express = require('express');
const router = express.Router();
const controller = require('../controllers/resetPasswordController');

router.get('/reset/password/:id', controller.renderPage);

router.post('/api/reset/password/:id', controller.resetPassword);

module.exports = router;