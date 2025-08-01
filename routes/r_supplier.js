const express = require('express');
const router = express.Router();
const controller = require('../controllers/supplierController');

router.get('/supplier/:id', controller.renderPage);

module.exports = router;