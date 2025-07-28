const EmployeeAccount = require('../models/employeeAccounts');
const bcrypt = require('bcrypt');

exports.renderPage = async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role?.trim() !== 'Manager') {
            return res.redirect('/login'); 
        }
        res.render('memberCreate', {
            layout: 'form',
            script: 'memberSupplierCreate',
            title: 'Add team member',
            page: 'member-create',
            user: req.session.user,
        });
    } catch (error) {
        console.error('Render error (member):', error);
        res.status(500).send('Failed to load member creation page');
    }
};

exports.createMember = async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role?.trim() !== 'Manager') {
            return res.status(403).send('Unauthorized');
        }
        const {
            ['first-name']: firstName,
            ['last-name']: lastName,
            ['mobile-number']: mobileNumber,
            password
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10); 

        const newMember = new EmployeeAccount({
            _id: mobileNumber,
            firstName,
            lastName,
            password: hashedPassword,  
            role: 'Team Member',
            status: 'unactivated',
        });

        await newMember.save();
        res.redirect('/teamList');
    } catch (error) {
        console.error('Error adding team member:', error);
        res.status(500).send('Failed to add team member');
    }
};
