const bcrypt = require('bcrypt');
const EmployeeAccount = require('../models/employeeAccounts');
const Notification = require('../models/notifications');
const { v4: uuidv4 } = require('uuid');


// to handle login functionality
exports.getLoginPage = (req, res) => {
    const success = req.session.success;
    const error = req.session.error;
    req.session.success = null;
    req.session.error = null;
    res.render('login', { 
        layout: 'login',
        stylesheet: 'login',
        title: 'Login',
        success, 
        error
    });
}
 
// to handle employee authentication
exports.authenticateEmployee = async (req, res) => {
    try {
        console.log("POST /login controller triggered");

        const number = req.body.number?.trim();
        const password = req.body.password?.trim();

        console.log("Login POST Request - Received data:");
        console.log("Contact Number:", number);
        console.log("Password:", password); 

        if (!number && !password) {
            return res.render('login', {
                layout: 'login',
                error: "Contact number and password are required"
            });
        }
        if (!number) {
            return res.render('login', {
                layout: 'login',
                error: "Contact number is required"
            });
        }
        if (!password) {
            return res.render('login', {
                layout: 'login',
                error: "Password is required"
            });
        }

        const employee = await EmployeeAccount.findOne({
            _id: number,
            status: { $in: ['active', 'unactivated'] }
        });
        
        console.log("Fetched employee:", employee);
        
        if (!employee) {
            return res.render('login', {
                layout: 'login',
                error: "Login credentials invalid. If your number isn’t in our system, contact the Admin."
            });
        }
        
        const isPasswordMatch = await bcrypt.compare(password, employee.password);
        if (!isPasswordMatch) {
            return res.render('login', {
                layout: 'login',
                error: "Login credentials invalid. If your number isn’t in our system, contact the Admin."
            });
        }

        // If the employee is currently unactivated, update their status to active
        if (employee.status === 'unactivated') {
            employee.status = 'active';
            await employee.save();
            console.log(`Updated status for ${employee._id} to active`);
        }

        req.session.user = {
            _id: employee._id,
            email: employee.email,
            firstName: employee.firstName,
            lastName: employee.lastName,
            role: employee.role,
            userType: "employee"
        };

        

        return res.redirect('/eventlist');
        

    } catch (error) {
        console.error("Authentication error:", error);
        return res.render('login', {
            layout: 'login',
            error: "Server error"
        });
    }
};

// if GET
exports.authenticateEmployeeGet = async (req, res) => {
    try {
        const { number, password } = req.query;

        console.log("Login GET Request - Received data:");
        console.log("Contact Number:", number);
        console.log("Password:", password); 

        if (!number && !password) {
            return res.render('login', {
                layout: 'login',
                error: "Contact number and password are required"
            });
        }
        if (!number) {
            return res.render('login', {
                layout: 'login',
                error: "Contact number is required"
            });
        }
        if (!password) {
            return res.render('login', {
                layout: 'login',
                error: "Password is required"
            });
        }

        const employee = await EmployeeAccount.findById(number);
        console.log("Fetched employee:", employee);

        if (!employee) {
            return res.render('login', {
                layout: 'login',
                error: "Employee not found"
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, employee.password);
        if (!isPasswordMatch) {
            return res.render('login', {
                layout: 'login',
                error: "Incorrect password"
            });
        }

        req.session.user = {
            _id: employee._id,
            email: employee.email,
            userType: "employee"
        };

        return res.redirect('/eventlist');

    } catch (error) {
        console.error("Authentication error:", error);
        return res.render('login', {
            layout: 'login',
            error: "Server error"
        });
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
      const { number } = req.body;
  
      // Validate that the requesting employee exists
      const sender = await EmployeeAccount.findById(number);
      if (!sender) {
        return res.render('login', { layout: 'login', error: 'Employee not found.' });
      }
  
      // Get all active managers
      const managers = await EmployeeAccount.find({ role: 'Manager', status: 'active' });
  
      // Create a notification for each manager
      const notifications = managers.map(manager => ({
        _id: uuidv4(),
        sender: number,
        receiver: 'Manager',
        receiverID: manager._id,
        message: `${sender.firstName} ${sender.lastName} has requested a password reset.`,
        date: new Date(),
        hideFrom: []
      }));
  
      // Insert notifications into the database
      await Notification.insertMany(notifications);
  
      return res.render('login', { layout: 'login', success: 'Password reset request sent to managers.' });
  
    } catch (error) {
      console.error('Forgot Password Notification Error:', error);
      return res.render('login', { layout: 'login', error: 'Server error while sending notifications.' }); // change file name (login) if necessary
    }
};

exports.getForgotPasswordPage = async (req, res) => {
    res.render('forgot', {
        layout: 'login',
        stylesheet: 'forgot',
        title: 'Forgot Password',
    });
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }

      res.redirect('/');
    });
    };
  