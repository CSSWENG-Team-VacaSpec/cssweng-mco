const EmployeeAccount = require('../models/employeeAccounts');   

exports.renderPage = async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role?.trim() !== 'Manager') {
            return res.redirect('/login'); 
        }
        const members = await EmployeeAccount.find({ status: 'active' }).lean();
        
        res.render('memberDelete', {
            layout: 'form',
            script: 'memberDelete',
            title: 'Delete team members',
            page: 'member-delete',
            user: req.session.user,
            members: members
        });
    } catch (error) {
        console.error('Could not load member deletion page.');
    }
}

exports.deleteMember = async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role?.trim() !== 'Manager') {
            return res.status(403).send('Unauthorized');
        }

        console.log('BODY:', req.body); // keep for testing

        let memberIds = req.body.memberIds;

        // Convert to array if it's a single string
        if (typeof memberIds === 'string') {
            memberIds = [memberIds];
        }

        if (!Array.isArray(memberIds) || memberIds.length === 0) {
            return res.status(400).send('No members selected');
        }

        await EmployeeAccount.updateMany(
            { _id: { $in: memberIds } },
            { $set: { status: 'terminated' } }
        );

        res.redirect('/teamList');
    } catch (error) {
        console.error('Error deleting team member:', error);
        res.status(500).send('Failed to delete team member');
    }
};
