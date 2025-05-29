const bcrypt = require('bcrypt');
const EmployeeAccount = require('../models/employeeAccounts');
const Notification = require('../models/notifications');
const { v4: uuidv4 } = require('uuid');

// to handle login functionality
exports.getLoginPage = (req, res) => {
    res.render('login');
}
 
// to handle employee authentication
exports.authenticateEmployee = async (req, res) => {
    try {
        const { contactNumber, password } = req.body;

        // Validate input
        if (!contactNumber && !password) {
            return res.status(400).json({ error: "Contact number and password are required" });
        }
        if (!contactNumber) {
            return res.status(400).json({ error: "Contact number is required" });
        }
        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }        

        // Find employee by contact number
        const employee = await EmployeeAccount.findById(contactNumber);

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        const isPasswordMatch = await bcrypt.compare(password, employee.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        // Store minimal user info in session
        req.session.user = {
            _id: employee._id, // contact number
            email: employee.email,
            userType: "employee"
        };

        console.log("Employee stored in session:", req.session.user);

        return res.json({
            success: true,
            _id: employee._id,
            email: employee.email,
            firstName: employee.firstName,
            lastName: employee.lastName
        });        

    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};


/* FORGOT PASSWORD PROCESS 
Manager makes temp pw for employee
Employee changes temp pw 

IF PASSWORD FORGOTTEN

notifies manager and manager resets pw and makes another temp pw
managers gives temp pw to employee
employee changes temp pw */

// sends notifications to all managers when a user requests a password reset
exports.forgotPasswordRequests = async (req, res) => {
    try {
      const { contactNumber } = req.body;
  
      // validate that the requesting employee exists
      const sender = await EmployeeAccount.findById(contactNumber);
      if (!sender) {
        return res.status(404).json({ error: 'Employee not found' });
      }
  
      // get all active managers
      const managers = await EmployeeAccount.find({ role: 'Manager', status: 'active' });
  
      // create a notification for each manager
      const notifications = managers.map(manager => ({
        _id: uuidv4(),
        sender: contactNumber,
        receiver: 'Manager',
        receiverID: manager._id,
        message: `${sender.firstName} ${sender.lastName} has requested a password reset.`,
        date: new Date(),
        hideFrom: []
      }));
  
      // insert notifications into the database
      await Notification.insertMany(notifications);
  
      return res.status(200).json({ message: 'Password reset request sent to managers.' });
  
    } catch (error) {
      console.error('Forgot Password Notification Error:', error);
      return res.status(500).json({ error: 'Server error while sending notifications.' });
    }
  };