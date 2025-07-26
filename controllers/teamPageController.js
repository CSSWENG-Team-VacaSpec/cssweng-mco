const EmployeeAccount = require('../models/employeeAccounts');
const Team = require('../models/teams');
const searchEmployees = require('../utils/searchEmployees');
const mongoose = require('mongoose');

exports.getTeamPage = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const userId = req.session.user._id || req.session.user;
        const role = req.session.user.role?.trim();
        const isManager = role === 'Manager';

        const searchQuery = req.query.q?.trim();

        // Fetch employees
        let employees = await EmployeeAccount.find(
            { status: { $in: ['active', 'unactivated'] } },
            '-password'
        ).lean();

        // Convert pfp buffer to base64
        employees.forEach(emp => {
            if (emp.pfp?.data && emp.pfp?.contentType) {
                emp.pfp = `data:${emp.pfp.contentType};base64,${emp.pfp.data.toString('base64')}`;
            } else {
                emp.pfp = null;
            }

            // Normalize role here
            emp.role = emp.role?.trim();
        });

        // if searching, filter employees using fuzzy search
        if (searchQuery && searchQuery !== '') {
            employees = searchEmployees(employees, searchQuery);
        }

        const managers = employees.filter(emp => emp.role === 'Manager');
        const members = employees.filter(emp => emp.role === 'Team Member');
        
        res.render('teamList', {
            layout: 'teamListLayout',
            stylesheet: 'teamList',
            script: 'teamList',
            title: 'Team List',
            page: 'team-members',
            user: req.session.user,
            managers, 
            isManager,
            searchQuery,
            members});
    } catch (error) {
        console.error('Error loading team page:', error);
        res.status(500).send('Server Error: Unable to load team.');
    }
};