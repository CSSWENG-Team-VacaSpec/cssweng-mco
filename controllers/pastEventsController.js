const Event = require('../models/events');
const Team = require('../models/teams');

const mongoose = require('mongoose');

exports.getPastEventsPage = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        // handle pagination.
        const pageNum = parseInt(req.query.page) || 1;
        const DOCUMENTS_PER_PAGE = 10;

        const userId = req.session.user._id || req.session.user;
        const role = req.session.user.role?.trim();

        const isManager = role === 'Manager'; 
        const showCreateButton = isManager

        const teams = await Team.find({
            $or: [
                { manager: userId },
                { programLead: userId },
                { teamMemberList: userId }
            ]
        });

        if (!teams || teams.length === 0) {
            console.log('User is not assigned to any teams.');
            return res.render('pastEvents', {
                layout: 'main',
                stylesheet: 'pastEvents',
                script: 'pastEvents',
                user: req.session.user,
                events: [],
                showCreateButton,
                page: 'past-events'
            });
        }

        const poNumbers = teams.map(team => team._id);

        const events = await Event.find({ 
            _id: { $in: poNumbers },
            status: { $in: ['completed', 'cancelled'] }
        }).skip((pageNum - 1) * DOCUMENTS_PER_PAGE)
          .limit(DOCUMENTS_PER_PAGE);

        // total events count.
        const totalEvents = await Event.countDocuments({
            _id: { $in: poNumbers },
            status: { $in: ['completed', 'cancelled'] }
        });

        const pages = Math.ceil(totalEvents / DOCUMENTS_PER_PAGE);

        res.render('pastEvents', {
        layout: 'main',
        stylesheet: 'pastEvents',
        script: 'pastEvents',
        title: 'Past Events',
        user: req.session.user, 
        events: events.map(event => ({
            _id: event._id,
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
        showCreateButton,
        page: 'past-events',
        pageCount: pages,
        currentPageNumber: pageNum
    });

    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).send("Internal server error");
    }
};