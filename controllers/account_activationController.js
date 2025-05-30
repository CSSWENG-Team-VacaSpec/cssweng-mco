/* Allow managers to create and activate accounts for employees

create Account = Creates an account for new employees*/


const EmployeeAcc = require('../models/employeeAccounts');
const Employee = require('../models/employees');

exports.createAccount = async (req, res) => {
  const { contactNo, password, role} = req.body; 

  try {
    const newAccount = new EmployeeAcc({
      _id: contactNo, 
      password: password
    });

    await newAccount.save(); // Save to DB

    const employeeRole = new Employee({
        _id: contactNo,
        role : role
    })

    await employeeRole.save()
    res.status(201).json({ message: 'Account created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create account' });
  }
};
