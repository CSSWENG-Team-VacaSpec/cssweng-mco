const Team = require('../models/teams');
const Event = require('../models/events');
const User = require('../models/employeeAccounts');
const searchEventParticipants = require('../utils/searchEventParticipants');
const Invitation = require ('../models/eventInvitations');
const Suppliers = require('../models/suppliers');
const EmployeeAccount = require('../models/employeeAccounts');

exports.getEventDetailsPage = async (req, res) => {
    try {

        const userId = req.session.user._id || req.session.user;
        const eventId = req.query.id;
        
        const team = await Team.findById(eventId).lean();
        let event;
        let isManager = false;
        let isProgramLead = false;
        
        if (String (team.manager) === String (userId) ) {
            isManager = true;
        }
        
        if (String (team.programLead) === String (userId) ) {
            isProgramLead = true;
        }
        
        if (isManager) {
            event = await Event.findById(eventId).lean();
        } else {
            event = await Event.findById(eventId).select(['-CPContactNo', '-CPFirstName', '-CPLastName']).lean();
        }

        const isPastEvent = ['completed', 'cancelled'].includes(event.status?.toLowerCase());
        const showButtons = (isManager || isProgramLead) && !isPastEvent;
        
        const userIds = [
            team.manager,
            team.programLead,
            ...team.teamMemberList
        ];

        const users = (await User.find({ _id: { $in: userIds } }).lean()).map(user => ({
            ...user,
            isSelf: String(user._id) === String(userId)
            }));
        const supplierList = await Suppliers.find({_id: { $in: team.supplierList }}).lean();
        
        const unavailableInvitations = await Invitation.find({ 
            event: eventId,
            response: 'unavailable'
        });
        const pendingInvitations = await Invitation.find({ 
            event: eventId,
            response: 'pending'
        });

        const unavailableContacts = unavailableInvitations.map(invite => invite.employeeCN);
        const pendingContacts = pendingInvitations.map(invite => invite.employeeCN)

        const unavailableMembers = await User.find({
            _id: { $in: unavailableContacts }
        }).lean();

        const pendingMembers = await User.find({
            _id: { $in: pendingContacts }
        }).lean();
        
        res.render('eventDetails', {
            user: req.session.user,
            currentUserId: userId,
            layout: 'main',
            stylesheet: 'eventDetails',
            script: 'eventDetails',
            title: 'Event Details',
            page: 'event-details',
            showButtons,
            teamMembers: users,
            unavailableMembers: unavailableMembers,
            pendingMembers: pendingMembers,
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
