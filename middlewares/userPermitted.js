const EmployeeAccount = require('../models/employeeAccounts'); 

// Middleware that checks if the user's role is allowed
module.exports = function (allowedRoles) {
  return async function (req, res, next) {
    try {
      // If no user is logged in
      if (!req.session.user || !req.session.user._id) {
        return res.status(401).send('Unauthorized: No user logged in.');
      }

      // Fetch latest user data from database in case role/status changed
      const user = await EmployeeAccount.findById(req.session.user._id);

      if (!user) {
        return res.status(404).send('User not found.');
      }

      // Block if the account is not active
      if (user.status !== 'active') {
        return res.status(403).send(`Account status is '${user.status}'. Access denied.`);
      }

      // Check if the user's role is in the allowedRoles list
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).send('Forbidden: Insufficient permissions.');
      }

      // Save the fresh user object to req.session.user for later use
      req.session.user = user;

      // Proceed to the next middleware/controller
      next();
    } catch (err) {
      console.error('checkRole error:', err);
      res.status(500).send('Internal Server Error');
    }
  };
};



/* 
       Sample Usage


ROUTER
const checkRole = require('../middlewares/userPermitted');
const someController = require('../controllers/someController');

// Only Managers can access this route
router.get('/manager/panel', checkRole(['Manager']), someController.managerPanel);

// Both Managers and Team Members can access this
router.get('/team/dashboard', checkRole(['Manager', 'Team Member']), someController.teamDashboard);


CONTROLLER
// controllers/adminController.js

exports.dashboardPage = (req, res) => {
  // Render the admin dashboard page
  res.render('adminDashboard', {
    user: req.session.user, // pass user data to the template
  });
};


*/
