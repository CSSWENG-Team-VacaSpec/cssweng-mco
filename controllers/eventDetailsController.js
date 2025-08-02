const Team = require('../models/teams');
const Event = require('../models/events');
const User = require('../models/employeeAccounts');
const searchEventParticipants = require('../utils/searchEventParticipants');
const Suppliers = require('../models/suppliers');


exports.getEventDetailsPage = async (req, res) => {
    try {

        const userId = req.session.user._id || req.session.user;
        const eventId = req.query.id;
        
        const team = await Team.findById(eventId).lean();
        const event = await Event.findById(eventId).lean(); 
        let isManager = false;
        let isProgramLead = false;

        if (String (team.manager) === String (userId) ) {
            isManager = true;
        }

        if (String (team.programLead) === String (userId) ) {
            isProgramLead = true;
        }

        const isPastEvent = ['completed', 'cancelled'].includes(event.status?.toLowerCase());
        const showButtons = (isManager || isProgramLead) && !isPastEvent;

        const userIds = [
            team.manager,
            team.programLead,
            ...team.teamMemberList
        ];

        const users = await User.find({ _id: { $in: userIds } }).lean();
        const supplierList = await Suppliers.find({_id: { $in: team.supplierList }}).lean();

        // Convert pfp buffer to base64
        users.forEach(emp => {
            if (emp.pfp?.data && emp.pfp?.contentType) {
                emp.pfp = `data:${emp.pfp.contentType};base64,${emp.pfp.data.toString('base64')}`;
            } else {
                emp.pfp = '/common/user.svg';
            }

            // Normalize role here
            emp.role = emp.role?.trim();
        });
        
        console.log(supplierList)
        res.render('eventDetails', {
            user: req.session.user,
            layout: 'main',
            stylesheet: 'eventDetails',
            script: 'eventDetails',
            title: 'Event Details',
            page: 'event-details',
            showButtons,
            teamMembers: users,
            team,
            event,
            supplierList
        });
    }   catch (error) {
        console.error("Error opening event:", error);
        res.status(500).send("Internal server error");
    }
    
};

exports.searchEventParticipants = async (req, res) => {
    try {
        const { q, id } = req.query;
        if (!q || !id) return res.status(400).json({ members: [], suppliers: [] });

        const results = await searchEventParticipants(id, q);
        res.json(results);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ members: [], suppliers: [] });
    }
};
