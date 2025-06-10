const EmployeeAccount = require('../models/employeeAccounts');
const searchEmployees = require('../utils/searchEmployees');

// This function handles the search request for employees
exports.searchEmployees = async (req, res) => {
  try {
    const query = req.query.q || '';

    // fetch all active employees
    const employees = await EmployeeAccount.find({ status: 'active' }).lean();

    // search employees using the search utility
    const results = searchEmployees(employees, query);

    return res.status(200).json({ results });
    
  } catch (error) {
    console.error('Employee search failed:', error);
    return res.status(500).json({ error: 'Server error during employee search' });
  }
};
