const EmployeeAccount = require('../models/employeeAccounts');   
const { v4: uuidv4 } = require('uuid');

exports.renderPage = async (req, res) => {
    try {
        res.render('memberCreate', {
            layout: 'form',
            stylesheet: 'memberCreate',
            script: 'memberCreate',
            title: 'Add team member',
            page: 'member-create',
            user: req.session.user,
        });
    } catch (error) {

    }
}

exports.createMember = async (req, res) => {
    try {
    } catch (error) {
        console.error('Error adding team member:', error);
        res.status(500).send('Failed to add team member');
    }
};
