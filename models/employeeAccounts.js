const mongoose = require('mongoose');

const employeeAccountSchema = new mongoose.Schema({
    _id: { type: String, required: true }, //contactNumber of the employee
    email: { type: String, required: false },
    firstName: { type: String, required: true }, 
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    pfp: {
        data: Buffer,
        contentType: String
    },
    createdAt: { type: Date, default: Date.now }
}, 
{ collection: "employeeAccounts" }); 

const EmployeeAccount = mongoose.model("EmployeeAccount", employeeAccountSchema); 
module.exports = EmployeeAccount;