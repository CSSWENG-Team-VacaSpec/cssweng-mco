exports.getEventListPage = (req, res) => {
    res.render('eventList', {
        layout: 'eventListLayout'
    });
};