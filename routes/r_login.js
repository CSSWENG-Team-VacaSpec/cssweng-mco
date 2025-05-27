const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login');

// Route to render the login page
router.get('/login', loginController.getLoginPage);

// Route to handle user authentication
router.post('/login', loginController.authenticateEmployee);