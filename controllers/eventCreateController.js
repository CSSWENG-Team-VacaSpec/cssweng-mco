exports.renderPage = (req, res) => {
    try {
        res.render('eventCreate', {
            layout: 'main',
            stylesheet: 'eventCreate',
            script: 'eventCreate',
            title: 'Create Event',
            page: 'event-create',
            user: req.session.user
        });
    } catch (error) {

    }
}