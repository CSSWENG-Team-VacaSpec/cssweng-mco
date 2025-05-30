const express = require('express');
const router = express.Router();
const employeeAuthController = require('../controllers/loginController');

// Route to display login page
router.get('/login', employeeAuthController.getLoginPage);

// Route to handle login form submission
router.post('/login', employeeAuthController.authenticateEmployee);

// Route to handle forgot password request 
router.post('/forgot-password', employeeAuthController.forgotPasswordRequests);

module.exports = router;
