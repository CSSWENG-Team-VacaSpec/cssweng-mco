const EmployeeAccount = require('../models/employeeAccounts');

exports.renderPage = async (req, res) => {
    const members = await EmployeeAccount.find({ status: 'active' }).lean();
    
    try {
        res.render('eventCreate', {
            layout: 'main',
            stylesheet: 'eventCreate',
            script: 'eventCreate',
            title: 'Create Event',
            page: 'event-create',
            user: req.session.user,
            members
        });
    } catch (error) {

    }
}