// routes/rr_login.js
const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// GET login page
router.get('/', loginController.getLoginPage);

// GET login form submission
router.get('/login', loginController.authenticateEmployeeGet);

// POST login form submission (in case the form uses POST)
router.post('/login', loginController.authenticateEmployee);

// Forgot password
router.get('/forgot-password', loginController.getForgotPasswordPage);
router.post('/forgot-password', loginController.forgotPasswordRequests);

// Logout
router.get('/logout', loginController.logout);

module.exports = router;
