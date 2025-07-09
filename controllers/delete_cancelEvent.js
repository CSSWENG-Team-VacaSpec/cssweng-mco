const Event = require('../models/events');
const DeleteNotif = require('../utils/deleteNotification');
const CancelNotif = require('../utils/cancelNotification');

exports.cancelEvent = async (req, res) => {
    const eventId = req.query.id;

    try {
        const event = await Event.findById(eventId);
        const sender = req.session.user?._id;
        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        // Update status to 'cancelled'
        event.status = 'cancelled';
        await event.save();

        console.log("event cancelled");
        await CancelNotif(event,sender);

        res.redirect('/notifications');

    } catch (err) {
        console.error('Error cancelling event:', err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};



exports.deleteEvent = async (req, res) => {
    const eventId = req.query.id;

    try {
        const event = await Event.findById(eventId);
        const sender = req.session.user?._id;

        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        await DeleteNotif(event,sender);

        await Event.findByIdAndDelete(eventId);

        res.redirect('/notifications');
            
    } catch (err) {
        console.error('Error deleting event:', err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

