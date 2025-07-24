exports.renderPage = async (req, res) => {
    try {
        res.render('profileEdit', {
            layout: 'form',
            script: 'profileEdit',
            stylesheet: 'profileEdit',
            page: 'profile-edit',
            title: 'Edit your profile',
            user: req.session.user
        });
    } catch (error) {
        console.error('Could not load profile editor.', error);
    }
};