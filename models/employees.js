const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    _id: { type: String, required: true }, //contactNumber of the employee
    role: {
        type: String, 
        required: true,
        enum: ['Manager', 'Team Member'],
        default: 'Team Member'
      }
}, 
{ collection: "employees" }); 

const Employee = mongoose.model("Employee", employeeSchema); 
module.exports = Employee;