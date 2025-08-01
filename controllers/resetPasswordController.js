const EmployeeAccount = require('../models/employeeAccounts');

exports.renderPage = async (req, res) => {
    const user = await EmployeeAccount.findOne({
        _id: req.session.user._id
    }).lean();

    const resetUser = await EmployeeAccount.findOne({
        _id: req.params.id
    }).lean();

    try {
        res.render('resetPassword', {
            layout: 'form',
            script: 'resetPassword',
            page: 'reset-password',
            title: 'Reset password for ' + resetUser.firstName + ' ' + resetUser.lastName,
            user: user,
            resetUser: resetUser
        });
    } catch (error) {
        console.error('Could not load profile editor.', error);
    }
};

// TODO: reset password post route
exports.resetPassword = async (req, res) => {

};