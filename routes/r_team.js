const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamPageController');

router.get(['/', '/teamList'], teamController.getTeamPage);

module.exports = router;