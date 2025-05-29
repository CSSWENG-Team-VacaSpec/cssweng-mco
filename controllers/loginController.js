const bcrypt = require('bcrypt');
const EmployeeAccount = require('../models/employeeAccounts');

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