const Event = require('../models/events');
const mongoose = require('mongoose');

exports.getEventListPage = async (req, res) => {
    try {

        const events = await Event.find();
        console.log(Event.collection.name); // Should be 'events'
        console.log("🧭 Connected DB:", mongoose.connection.name);
        if (events.length === 0) {
        console.log('📭 No gievents found in the database.');
} else {
  console.log('📦 Events fetched from MongoDB:', events);
}

        res.render('eventList', {
            layout: 'eventListLayout',
            events: events.map(event => ({
                eventName: event.eventName,
                companyName: event.companyName,
                clientFirstName: event.clientFirstName,
                clientLastName: event.clientLastName,
                eventDate: event.eventDate,
                description: event.description,
                status: event.status,
                location: event.location,
                CPFirstName: event.CPFirstName,
                CPLastName: event.CPLastName,
                CPContactNo: event.CPContactNo
            })),
            page: 'upcoming-events'
        });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).send("Internal server error");
    }
};