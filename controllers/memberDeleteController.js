const EmployeeAccount = require('../models/employeeAccounts');   

exports.renderPage = async (req, res) => {
    try {
        const members = await EmployeeAccount.find({ status: 'active' }).lean();
        res.render('memberDelete', {
            layout: 'form',
            script: 'memberSupplierDelete',
            title: 'Delete team members',
            page: 'member-delete',
            user: req.session.user,
            members: members
        });
    } catch (error) {

    }
}

exports.deleteMember = async (req, res) => {
    try {
    } catch (error) {
        console.error('Error deleting team member:', error);
        res.status(500).send('Failed to delete team member');
    }
};
