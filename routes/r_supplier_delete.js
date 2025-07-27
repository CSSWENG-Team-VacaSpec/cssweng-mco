const express = require('express');
const router = express.Router();
const controller = require('../controllers/supplierDeleteController');

router.get('/delete/supplier', controller.renderPage);

router.post('/api/delete/supplier', controller.deleteSupplier);

module.exports = router;