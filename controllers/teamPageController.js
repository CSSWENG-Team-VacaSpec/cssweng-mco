const EmployeeAccount = require('../models/employeeAccounts');
const Team = require('../models/teams');
const mongoose = require('mongoose');

exports.getTeamPage = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const userId = req.session.user._id || req.session.user;
        const role = req.session.user.role?.trim();
        const isManager = role === 'Manager';
        const showCreateButton = isManager

        const teams = await Team.find({
            $or: [
                { manager: userId },
                { programLead: userId },
                { teamMemberList: userId }
            ]
        });

        if (!teams || teams.length === 0) {
            console.log('👤 No Team Members');
            return res.render('teamList', {
                layout: 'teamListLayout',
                user: req.session.user,
                page: 'team-members'
            });
        }

    const employees = await EmployeeAccount.find({ status: 'active' }).lean();

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
        members});
    } catch (error) {
    console.error('Error loading team page:', error);
    res.status(500).send('Server Error: Unable to load team.');
    }
};