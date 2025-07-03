const EmployeeAccount = require('../models/employeeAccounts');

exports.getTeamPage = async (req, res) => {
    try {
    const employees = await EmployeeAccount.find({ status: 'active' }).lean();

    const managers = employees.filter(emp => emp.role === 'Manager');
    const members = employees.filter(emp => emp.role === 'Team Member');

    res.render('teamList', {
        layout: 'teamListLayout',
        page: 'team-members',
        managers: "Manager",
        members: "Team Member" });
    } catch (error) {
    console.error('Error loading team page:', error);
    res.status(500).send('Server Error: Unable to load team.');
    }
};