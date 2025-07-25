const EmployeeAccount = require('../models/employeeAccounts');

exports.renderPage = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const profile = await EmployeeAccount.findOne({
            _id: req.params.id
        }).lean();

        // check if profile is your own or someone else's to determine
        // the highlight on the sidebar.
        let profileType = 'my-profile';

        if (req.params.id !== req.session.user._id) {
            profileType = 'other-profile'
        }

        console.log('viewing profile page of type ' + profileType + '\nid in params: ' + req.params.id + '\nid in session: ' + req.session._id);

        res.render('profile', {
            layout: 'main',
            stylesheet: 'profile',
            title: profile.firstName + ' ' + profile.lastName, // TODO: change to user being displayed
            page: profileType,
            user: req.session.user,
            profile: profile
        });

        console.log(profile);
    } catch (error) {
        console.error('Error loading profile page:', error);
        res.status(500).send('Server Error: Unable to load profile.');
    }
};