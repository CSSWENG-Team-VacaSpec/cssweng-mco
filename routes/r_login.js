const express = require('express');
const router = express.Router();
const employeeAuthController = require('../controllers/loginController');

// Route to display login page
router.get('/login', employeeAuthController.getLoginPage);

// Route to handle login form submission
router.post('/login', employeeAuthController.authenticateEmployee);

// Route to display forgot password page
router.get('/forgot-password', employeeAuthController.getForgotPasswordPage);

// Route to handle forgot password request 
router.post('/forgot-password-req', employeeAuthController.forgotPasswordRequests);

module.exports = router;
