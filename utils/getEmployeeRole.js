const EmployeeAccount = require('../models/employeeAccounts'); 

// Check if employee is Manager or Team Member
exports.getEmployeeRole = async (req, res) => {
  const { contactNumber } = req.params;

  try {
    // Use contactNumber as _id
    const employee = await EmployeeAccount.findById(contactNumber);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({
      contactNumber: employee._id,
      role: employee.role,
      status: employee.status
    });
  } catch (err) {
    console.error('Error fetching employee role:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
