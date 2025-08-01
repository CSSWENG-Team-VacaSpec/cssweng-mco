const EmployeeAccount = require('../models/employeeAccounts');
const Notification = require('../models/notifications');
const bcrypt = require('bcrypt');

exports.renderPage = async (req, res) => {

    if (!req.session.user || req.session.user.role !== 'Manager') {
        return res.redirect('/login');
    }

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
            resetUser: resetUser,
            error: req.query.error
        });
    } catch (error) {
        console.error('Could not load profile editor.', error);
    }
};

exports.resetPassword = async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role !== 'Manager') {
            return res.redirect('/login');
        }

        const userId = req.params.id;
        const newPassword = req.body['new-password'];

        if (!newPassword || newPassword.length < 8) {
            return res.redirect(`/reset/password/${userId}?error=short`);
        }

        const user = await EmployeeAccount.findById(userId);
        if (!user) {
            return res.redirect(`/reset/password/${userId}?error=notfound`);
        }

        let isSame = false;

        if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
            isSame = await bcrypt.compare(newPassword, user.password);
        } else {
            isSame = newPassword === user.password;
        }

        if (isSame) {
            return res.redirect(`/reset/password/${userId}?error=same`);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await EmployeeAccount.updateOne(
            { _id: userId },
            { $set: { password: hashedPassword } }
        );

        await Notification.deleteMany({
            sender: userId,
            message: { $regex: /requested a password reset/i }
        });

        return res.redirect('/teamList');
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.redirect(`/reset/password/${req.params.id}?error=server`);
    }
};
