const express = require('express');
const router = express.Router();
const controller = require('../controllers/memberDeleteController');

router.get('/delete/user', controller.renderPage);

router.post('/api/delete/user', controller.deleteMember);

module.exports = router;