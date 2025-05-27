const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    _id: { type: String, required: true }, //contactNumber
    role: {
        type: String, 
        required: true,
        enum: ['Manager', 'Team Member'],
        default: 'Team Member'
      },
    status: { 
        type: String, 
        required: true,
        enum: ['active', 'on leave', 'unactivated', 'terminated'],
        default: 'unactivated'
      }
    }, 
{ collection: "employees" }); // collection name

const Employee = mongoose.model("Employee", employeeSchema); 
module.exports = Employee;