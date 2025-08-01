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
            resetUser: resetUser
        });
    } catch (error) {
        console.error('Could not load profile editor.', error);
    }
};

exports.resetPassword = async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role !== 'Manager') {
            return res.status(403).send('Unauthorized');
        }

        const userId = req.params.id;
        const newPassword = req.body['new-password'];

        if (!newPassword) {
            return res.status(400).send('Password is required');
        }

        if (newPassword.length < 8) {
            return res.status(400).send('Password must be at least 8 characters long');
        }

        const user = await EmployeeAccount.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) {
            return res.status(400).send('New password must not match the old password');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await EmployeeAccount.updateOne(
            { _id: userId },
            { $set: { password: hashedPassword } }
        );

        // Delete related reset-password notifications
        await Notification.deleteMany({
            sender: userId,
            message: { $regex: /requested a password reset/i }
        });
        res.redirect('/teamList');
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).send('Server error while resetting password');
    }
};