/* Allow managers to create and activate accounts for employees

create Account = Creates an account for new employees*/


const EmployeeAcc = require('../models/employeeAccounts');
// make terminate account     
exports.createAccount = async (req, res) => {
  const { contactNo, password, role} = req.body; 

  try {
    const newAccount = new EmployeeAcc({
      _id: contactNo, 
      password: password,
      role : role

    });

    await newAccount.save(); 


    res.status(201).json({ message: 'Account created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create account' });
  }
};

exports.terminateAccount = async (req, res) => {
  const {contactNo, status} = req.body; 

  try {
    const employee = await EmployeeAcc.findById(contactNo);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    employee.status = "terminated"; 
    await employee.save(); 

   
    res.status(201).json({ message: 'Account terminated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to terminate account' });
  }
};
