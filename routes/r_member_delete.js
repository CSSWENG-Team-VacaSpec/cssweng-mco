const express = require('express');
const router = express.Router();
const controller = require('../controllers/memberDeleteController');

router.get('/delete/member', controller.renderPage);

router.post('/api/delete/member', controller.deleteMember);

module.exports = router;