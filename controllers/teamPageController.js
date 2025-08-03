const EmployeeAccount = require('../models/employeeAccounts');
const Supplier = require('../models/suppliers');
const Team = require('../models/teams');
const searchEmployees = require('../utils/searchEmployees');
const searchSuppliers = require('../utils/searchSuppliers');
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

        // Fetch suppliers
        let suppliers = await Supplier.find(
            { status: 'active'}
        ).lean();

        // if searching, filter employees using fuzzy search
        if (searchQuery && searchQuery !== '') {
            employees = searchEmployees(employees, searchQuery);
            suppliers = searchSuppliers(suppliers, searchQuery);
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
            members,
            suppliers
        });
    } catch (error) {
        console.error('Error loading team page:', error);
        res.status(500).send('Server Error: Unable to load team.');
    }
};