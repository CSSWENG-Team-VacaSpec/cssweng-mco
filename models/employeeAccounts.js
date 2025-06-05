const mongoose = require('mongoose');

const employeeAccountSchema = new mongoose.Schema({
    _id: { type: String, required: true }, //contactNumber of the employee
    email: { type: String},
    firstName: { type: String}, 
    lastName: { type: String},
    password: { type: String, required: true },
    bio: { type: String},
    pfp: {
        data: Buffer,
        contentType: String,
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