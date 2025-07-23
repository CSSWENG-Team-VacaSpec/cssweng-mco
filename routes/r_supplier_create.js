const express = require('express');
const router = express.Router();
const controller = require('../controllers/supplierCreateController');

// Route to render the events details page
router.get('/supplier', controller.renderPage);

router.post('/createSupplier', controller.createSupplier);

module.exports = router;