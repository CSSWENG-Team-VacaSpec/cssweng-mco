const User = require('../models/employeeAccounts');

exports.renderPage = async (req, res) => {
    const user = await User.findOne({
        _id: req.session.user._id
    }).lean();

    try {
        res.render('profileEdit', {
            layout: 'form',
            script: 'profileEdit',
            stylesheet: 'profileEdit',
            page: 'profile-edit',
            title: 'Edit your profile',
            user: user
        });

    } catch (error) {
        console.error('Could not load profile editor.', error);
    }
};