const mongoose = require('mongoose');

const employeeAccountSchema = new mongoose.Schema({
    _id: { type: String, required: true }, //contactNumber of the employee
    email: { type: String, required: false },
    firstName: { type: String, required: false }, 
    lastName: { type: String, required: false },
    password: { type: String, required: true },
    bio: { type: String, required: false },
    pfp: {
        data: Buffer,
        contentType: String,
        required: false
    },
    role: {
        type: String, 
        required: true,
        enum: ['Manager', 'Team Member'],
        default: 'Team Member'
    },
    createdAt: { type: Date, default: Date.now },
    status: {
        type: String, 
        required: true,
        enum: ['active', 'unactivated', 'terminated'],
        default: 'unactivated'
    }
}, 
{ collection: "employeeAccounts" }); 

const EmployeeAccount = mongoose.model("EmployeeAccount", employeeAccountSchema); 
module.exports = EmployeeAccount;