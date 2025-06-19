exports.getEventDetailsPage = (req, res) => {
    res.render('eventDetails', {
        layout: 'eventDetailsLayout',
        page: 'event-details'
    });
};