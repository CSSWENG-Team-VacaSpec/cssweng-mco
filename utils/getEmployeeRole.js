const Employee = require('../models/employees'); 

// Check if employee is Manager or Team Member
exports.getEmployeeRole = async (req, res) => {
  const { contactNumber } = req.params;

  try {
    const employee = await Employee.findById(contactNumber);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({
      contactNumber: employee._id,
      role: employee.role
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
