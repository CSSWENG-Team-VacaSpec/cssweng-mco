exports.getEventDetailsPage = (req, res) => {
    res.render('eventDetails', {
        layout: 'main',
        stylesheet: 'eventDetails',
        script: 'eventDetails',
        title: 'Event Details',
        page: 'event-details',
        user: req.session.user
    });
};